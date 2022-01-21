import {
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
import { BehaviorSubject, interval, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { LoaderService } from '../../core/loader.service';
import { MotRepositoryService } from '../../repositories/mot-repository.service';

@Component({
  selector: 'app-motus-mot-input',
  templateUrl: './motus-mot-input.component.html',
  styleUrls: ['./motus-mot-input.component.scss']
})
export class MotusMotInputComponent implements OnInit, OnChanges {
  static TEMPS_ANIMATION_REVELATION_LETTRE = 200;
  INPUT_MOT_LETTRE_ID_PREFIX: string = 'input-mot-lettre-';
  INPUT_MOT_LETTRE_ID_VALIDATED_PREFIX: string = 'input-mot-lettre-';
  LETTRE_BIEN_PLACE_CLASS = 'well-placed-letter'
  LETTRE_MAL_PLACE_CLASS = 'misplaced-letter'
  LETTRE_MAUVAISE_CLASS = 'bad-letter'


  @ViewChildren('inputElement') inputs: QueryList<ElementRef> = new QueryList<ElementRef>();
  @Input() motADeviner: string = '';
  @Input() validated: boolean = false;
  @Input() active: boolean = false;
  @Output() validateEvent: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();

  motLength: number = 0;
  motAsArray: string[] = [];
  validityClasses: string[] = [];

  private validationPendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  validationPending$: Observable<boolean> = this.validationPendingSubject.asObservable();

  constructor(
    private cdk: ChangeDetectorRef,
    private motRepositoryService: MotRepositoryService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.onMotChanged();
    this.onValidityChanged();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['motADeviner']) {
      this.onMotChanged();
    }
    if (changes['validated']) {
      this.onValidityChanged();
    }
  }

  onValiderClickHandler($event?: MouseEvent): void {
    if (this.validationPendingSubject.getValue()) {
      return;
    }
    this.validationPendingSubject.next(true);
    this.checkMotValide()
      .subscribe(
        {
          next: () => {
            this.validate().subscribe(
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

  onResetClickHandler($event: MouseEvent): void {
    this.inputs.toArray().forEach(
      (input: ElementRef) => {
        (input.nativeElement as HTMLInputElement).value = '';
      }
    )
  }

  private onMotChanged(mot: string = this.motADeviner): void {
    this.motLength = this.motADeviner.length;
    this.motAsArray = Array.from(this.motADeviner);
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
    if (this.getMot().includes('_') || this.getMot().trim().length < this.motADeviner?.length) {
      return throwError(() => new Error('Le mot est trop court'));
    }
    if (this.getMot().trim().length > this.motADeviner?.length) {
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

  private onValidityChanged(): void {
    if (!this.validated) {
      this.validityClasses = Array(this.motLength).fill("");
    } else {
      this.validate().subscribe();
    }
  }

  private validateMot(mot: string = this.getMot(), motADeviner: string = this.motADeviner): Observable<string> {
    return this.motRepositoryService.valiadteWord({
      motAValider: motADeviner,
      motSoumis: mot
    });
  }

  /**
   * Renvoie une chaine de caractères avec pour chaque lettre
   * + si la lettre est bien placé
   * - si la lettre n'est pas bien placé
   * . si la lettre n'existe pas ou plus dans le mot
   * @param mot
   * @param motADeviner
   * @private
   */
  private validate(mot: string = this.getMot(), motADeviner: string = this.motADeviner): Observable<string> {
    return this.validateMot(mot, motADeviner)
      .pipe(
        map(
          (motValide: string) => {
            const validityTempClasses = Array.from(motValide).map(
              (symbol: string) => {
                switch (symbol) {
                  case '+':
                    return this.LETTRE_BIEN_PLACE_CLASS;
                  case '-':
                    return this.LETTRE_MAL_PLACE_CLASS;
                  case '.':
                    return this.LETTRE_MAUVAISE_CLASS;
                  default:
                    return '';
                }
              }
            );
            this.validityClasses = new Array(this.motLength).fill("");

            interval(MotusMotInputComponent.TEMPS_ANIMATION_REVELATION_LETTRE).pipe(take(this.motLength)).subscribe(
              (intervalIterator: number) => {
                this.validityClasses[intervalIterator] = validityTempClasses[intervalIterator];
                this.cdk.detectChanges();
              }
            );
            return motValide;
          }
        )
      );
  }
}
