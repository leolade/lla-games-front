import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MotusRoundPropositionValidationDto } from 'lla-party-games-dto/dist/motus-round-proposition-validation.dto';
import { BehaviorSubject, interval, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { MotRepositoryService } from '../../repositories/mot-repository.service';
import { MotusRoundRepositoryService } from '../../repositories/motus-round-repository.service';

@Component({
  selector: 'app-motus-mot-input',
  templateUrl: './motus-mot-input.component.html',
  styleUrls: ['./motus-mot-input.component.scss']
})
export class MotusMotInputComponent implements OnInit, OnChanges, AfterViewInit {
  static TEMPS_ANIMATION_REVELATION_LETTRE = 200;
  INPUT_MOT_LETTRE_ID_PREFIX: string = 'input-mot-lettre-';
  INPUT_MOT_LETTRE_ID_VALIDATED_PREFIX: string = 'input-mot-lettre-';


  @ViewChildren('inputElement') inputs: QueryList<ElementRef> = new QueryList<ElementRef>();
  @Input() motLength: number = 0;
  @Input() validated: boolean = false;
  @Input() active: boolean = false;
  @Input() roundId: string = '';
  @Input() validationClass: string[] = [];
  @Input() preFilledWord: string = '';
  @Output() validateEvent: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();

  motLengthAsArray: number[] = [];
  validityClasses: string[] = [];

  private validationPendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  validationPending$: Observable<boolean> = this.validationPendingSubject.asObservable();

  constructor(
    private cdk: ChangeDetectorRef,
    private motRepositoryService: MotRepositoryService,
    private motusRoundRepositoryService: MotusRoundRepositoryService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.onMotLengthChange();
    this.preFillWord();
    this.applyValidationClassInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['motLength']) {
      this.onMotLengthChange();
    }
    if (changes['preFilledWord']) {
      this.preFillWord();
    }
    if (changes['validationClass']) {
      this.applyValidationClassInput();
    }
  }

  onValiderClickHandler(): void {
    if (this.validationPendingSubject.getValue()) {
      return;
    }
    this.validationPendingSubject.next(true);
    this.checkMotValide()
      .subscribe(
        {
          next: () => {
            this.makeProposition().subscribe(
              (motValide: string) => {
                this.validateEvent.emit([this.getMot(), motValide]);
                this.validationPendingSubject.next(false);
              }
            );
          },
          error: (error: Error) => {
            this.validationPendingSubject.next(false);
            this.snackBar.open(
              `Mot invalide : ${error?.message}`, undefined, {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000
              }
            );
          },
        }
      );
  }

  setNextLetter(key: string): void {
    const nextInput: HTMLInputElement | null = this.getFirstEmptyInput();
    if (nextInput) {
      nextInput.value = key;
    }
  }

  erasePreviousLetter(): void {
    const lastValuedInput: HTMLInputElement | null = this.getLastValuedInputInput();
    if (lastValuedInput) {
      lastValuedInput.value = '';
    }
  }

  onResetClickHandler(): void {
    this.inputs.toArray().forEach(
      (input: ElementRef) => {
        (input.nativeElement as HTMLInputElement).value = '';
      }
    )
  }

  applyValidationClass(classes: string[], interval: Observable<number>): void {
    this.validityClasses = new Array(this.motLength).fill("");
    interval.pipe(take(this.motLength)).subscribe(
      (intervalIterator: number) => {
        this.validityClasses[intervalIterator] = classes[intervalIterator];
        this.cdk.detectChanges();
      }
    );
  }

  ngAfterViewInit(): void {
    this.preFillWord();
  }

  private getFirstEmptyInput(inputs: ElementRef[] = this.inputs.toArray()): HTMLInputElement | null {
    if (!inputs?.length) {
      return null;
    }

    return inputs.find((input: ElementRef) => {
      return !((input.nativeElement as HTMLInputElement).value)
    })?.nativeElement as HTMLInputElement;
  }

  private getLastValuedInputInput(inputs: ElementRef[] = this.inputs.toArray()): HTMLInputElement | null {
    if (!inputs?.length) {
      return null;
    }

    if (!(inputs[0].nativeElement as HTMLInputElement).value) {
      return null;
    }

    let firstEmptyInputIndex: number = inputs.findIndex((input: ElementRef) => {
      return !((input.nativeElement as HTMLInputElement).value)
    });
    if (firstEmptyInputIndex < 0) {
      firstEmptyInputIndex = inputs.length;
    }

    return inputs[firstEmptyInputIndex - 1].nativeElement as HTMLInputElement;
  }

  private getMot(inputs: ElementRef[] = this.inputs.toArray()): string {
    return inputs.map(
      (elementRef: ElementRef) => elementRef?.nativeElement?.value || '_'
    ).join('');
  }

  private checkMotValide(): Observable<void> {
    if (this.getMot().includes('_') || this.getMot().trim().length < this.motLength) {
      return throwError(() => new Error('Le mot est trop court'));
    }
    if (this.getMot().trim().length > this.motLength) {
      return throwError(() => new Error('Le mot est trop long'));
    }
    return this.motRepositoryService.exist(this.getMot())
      .pipe(
        switchMap((motValide: boolean) => {
          if (motValide) {
            return of<void>(undefined);
          }
          return throwError(() => new Error(`Le mot n'existe pas`));
        })
      );
  }

  private makeProposition(mot: string = this.getMot()): Observable<string> {
    return this.motusRoundRepositoryService.makeProposition(
      this.roundId, {
        suggestWord: mot,
      }
    ).pipe(
      map(
        (propositionValide: MotusRoundPropositionValidationDto) => {
          return propositionValide.encodedValidation;
        }
      )
    )
  }

  private preFillWord(): void {
    if (this.preFilledWord?.length) {
      Array.from(this.preFilledWord).forEach(
        (letter: string) => {
          this.setNextLetter(letter);
        }
      )
    }
  }

  private applyValidationClassInput(): void {
    if (this.validationClass?.length) {
      this.applyValidationClass(this.validationClass, interval(0));
    }
  }

  private onMotLengthChange(): void {
    this.motLengthAsArray = Array(this.motLength).fill(0).map((x,i)=>i);
  }
}
