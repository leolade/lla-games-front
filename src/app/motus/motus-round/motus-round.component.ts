import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Data } from '@angular/router';
import { ConnectedUserDto } from 'lla-party-games-dto/dist/connected-user.dto';
import { MotusPlayerPropositionValideDto } from 'lla-party-games-dto/dist/motus-player-proposition-valide.dto';
import { MotusRoundRankDto } from 'lla-party-games-dto/dist/motus-round-rank.dto';
import { MotusRoundDto } from 'lla-party-games-dto/dist/motus-round.dto';
import { RoundEndSummaryDto } from 'lla-party-games-dto/dist/round-end-summary.dto';
import { UserDto } from 'lla-party-games-dto/dist/user.dto';
import { MotusPlayerGameDto } from 'lla-party-games-dto/src/motus-player-game.dto';
import { BehaviorSubject, forkJoin, interval, map, Observable, of, Subscription, switchMap, take } from 'rxjs';
import Keyboard from 'simple-keyboard';
import { ArrayUtils } from 'type-script-utils-lla/dist/array.utils';
import { DarkModeService } from '../../core/dark-mode.service';
import { UserService } from '../../core/user.service';
import { KeyboardEventService } from '../../keyboard-event.service';
import { MotRepositoryService } from '../../repositories/mot-repository.service';
import { MotusGameRepositoryService } from '../../repositories/motus-game-repository.service';
import { MotusRoundRepositoryService } from '../../repositories/motus-round-repository.service';
import { MotusMotInputComponent } from '../motus-mot-input/motus-mot-input.component';
import { MotusRoundClassementService } from './motus-round-classement.service';
import { MotusRoundService } from './motus-round.service';

@Component({
  selector: 'app-motus-round',
  templateUrl: './motus-round.component.html',
  styleUrls: ['./motus-round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotusRoundComponent implements AfterViewInit, OnDestroy {

  LETTRE_BIEN_PLACE_CLASS = 'well-placed-letter'
  LETTRE_MAL_PLACE_CLASS = 'misplaced-letter'
  LETTRE_MAUVAISE_CLASS = 'bad-letter'
  RESUME_TAB_INDEX = 1;

  @ViewChildren('motusMotInputComponent') inputs: QueryList<MotusMotInputComponent> = new QueryList<MotusMotInputComponent>();

  nbTry: number = 6;
  nbTryArray: number[] = Array.from(Array(this.nbTry).keys())
  validations: boolean[] = Array(this.nbTry).fill(false);
  keyboard: Keyboard | undefined;
  nbTryActive: number = 0;
  isWin: boolean = false;
  validationsClassInitialised: string[][] = [];
  preFilledWordInitialised: string[] = [];
  readonly: boolean = false;
  nameFC: UntypedFormControl = new UntypedFormControl();
  selectedTabIndex: number = 0;
  saveUsernameDisabled: boolean = false;
  private roundSubject: BehaviorSubject<MotusRoundDto | null> = new BehaviorSubject<MotusRoundDto | null>(null);
  round$: Observable<MotusRoundDto | null> = this.roundSubject.asObservable();
  private propositions: Map<number, [string, string]> = new Map()
  private userSubscription: Subscription;

  constructor(
    public motusRoundService: MotusRoundService,
    public motusRoundClassementService: MotusRoundClassementService,
    private userService: UserService,
    private keyboardEventService: KeyboardEventService,
    private motRepository: MotRepositoryService,
    private motusGameRepositoryService: MotusGameRepositoryService,
    private motusRoundRepositoryService: MotusRoundRepositoryService,
    private darkModeService: DarkModeService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.route.data.subscribe(
      (data: Data) => {
        if (data['round']) {
          const roundInfo: MotusRoundDto = data['round'][0];
          const playerRoundInfo: MotusPlayerGameDto = data['round'][1];

          if (playerRoundInfo) {
            this.validationsClassInitialised = []
            this.preFilledWordInitialised = []
            this.readonly = playerRoundInfo.readonly || false;
            playerRoundInfo.propositionsValides.forEach(
              (proposition: MotusPlayerPropositionValideDto, index: number) => {
                this.validations[index] = true;
                this.nbTryActive += 1;
                this.validationsClassInitialised.push(this.getClassesFromValidation(proposition.validation));
                this.preFilledWordInitialised.push(proposition.proposition);
                this.propositions.set(index, [proposition.proposition, proposition.validation])
              }
            )
            if (this.readonly) {
              this.nbTryActive = -1;
            }
          }

          if (playerRoundInfo) {
            this.roundSubject.next(roundInfo);
            if (this.readonly) {
              this.loadResume(roundInfo.roundId).subscribe();
              this.loadClassement(roundInfo.roundId).subscribe();
            }
          }
        }
      }
    )

    this.userSubscription = this.userService.user$.pipe().subscribe((user?: ConnectedUserDto | null) => {
      this.nameFC.setValue(user?.username);
      let roundId: string | undefined = this.roundSubject.getValue()?.roundId;
      if (roundId) {
        this.loadClassement(roundId).subscribe()
      }
    })
  }

  /**
   * On écoute toutes les touches tapés par l'utilisateur pour les reporter sur la grille de jeu.
   * @param $event
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown($event: KeyboardEvent) {
    if (!this.readonly && this.selectedTabIndex === 0) {
      if (this.keyboardEventService.isLetterKeyboardEvent($event)) {
        this.setNextLetter($event.key);
      } else if (this.keyboardEventService.isDeleteKeyboardEvent($event)) {
        this.erasePreviousLetter();
      } else if (this.keyboardEventService.isEnterKeyboardEvent($event)) {
        this.validateMot();
      }
    }
  }

  ngAfterViewInit() {
    if (!this.readonly) {
      // On paramètre le clavier virtuel
      this.keyboard = new Keyboard({
        onKeyPress: (button: string) => this.onKeyPress(button),
        layout: {
          default: [
            `A Z E R T Y U I O P {bksp}`,
            `Q S D F G H J K L M {enter}`,
            `W X C V B N`,
          ]
        },
        display: {
          '{bksp}': '←',
          '{enter}': '↵ <span class="enter-keyboard-text"> Entrée</span>',
        },
        theme: `hg-theme-default ${this.darkModeService.getDarkMode() ? 'dark-theme' : ''}`,
      });
      this.updateKeyboardDisabledButton();
    }
  }

  onValidateMot([proposition, validation]: [string, string], i: number, input: MotusMotInputComponent): void {
    this.propositions.set(i, [proposition, validation]);
    this.updateKeyboardDisabledButton();
    this.validations[i] = true;
    const isMotTrouve: boolean = Array.from(validation).findIndex((lettre: string) => lettre != '+') === -1;
    const isLastTry: boolean = (i + 1) === this.nbTry;
    this.applyInputValidityClasses(input, this.getClassesFromValidation(validation), interval(MotusMotInputComponent.TEMPS_ANIMATION_REVELATION_LETTRE))

    // Si la partie s'arrête
    if (isMotTrouve || isLastTry) {
      this.endRound(isMotTrouve, proposition);
    } else {
      this.nbTryActive += 1;
    }
  }

  applyInputValidityClasses(input: MotusMotInputComponent, classes: string[], interval: Observable<number>): void {
    input.applyValidationClass(classes, interval);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  saveUsername(): void {
    this.saveUsernameDisabled = true;
    this.userService.saveUsername(this.nameFC.value).subscribe(
      (user: UserDto) => {
        this.nameFC.setValue(user.username);
        this.saveUsernameDisabled = false;
        let roundId: string | undefined = this.roundSubject.getValue()?.roundId;
        if (roundId) {
          this.loadClassement(roundId).subscribe()
        }
      }
    )
  }

  private endRound(isMotTrouve: boolean, proposition: string): void {
    this.isWin = isMotTrouve;
    this.nbTryActive = -1;
    const round: MotusRoundDto | null = this.roundSubject.getValue();

    (round ?
      this.loadResume(round.roundId) :
      of(undefined)).pipe(
      switchMap((summary: RoundEndSummaryDto | undefined) => {
        return forkJoin([
          interval(MotusMotInputComponent.TEMPS_ANIMATION_REVELATION_LETTRE * (proposition.length + 1)).pipe(take(1)),
          of(summary),
          round ?
            this.loadClassement(round.roundId) :
            of([]),
        ]).pipe(
          map(() => summary)
        )
      }),
    )
      .subscribe(
        () => {
          this.readonly = true;
          this.selectedTabIndex = this.RESUME_TAB_INDEX;
          this.changeDetectorRef.detectChanges();
        }
      )
  }

  private onKeyPress(button: string): any {
    if (this.selectedTabIndex === 0 ) {
      switch (button) {
        case '{bksp}':
          this.erasePreviousLetter();
          break;
        case '{enter}':
          this.validateMot();
          break;
        default:
          this.setNextLetter(button);
          break;
      }
    }
  }

  private setNextLetter(key: string): void {
    this.getActiveInput()?.setNextLetter(key);
  }

  private erasePreviousLetter(): void {
    this.getActiveInput()?.erasePreviousLetter();
  }

  private getActiveInput(): MotusMotInputComponent | undefined {
    return this.inputs.toArray().find((motusMotInputComponent: MotusMotInputComponent) => motusMotInputComponent.active);
  }

  private validateMot(): void {
    this.getActiveInput()?.onValiderClickHandler();
  }

  private updateKeyboardDisabledButton(): void {
    this.updateKeyboardLettreAbsente();
    this.updateKeyboardLettreBienPlace();
    this.updateKeyboardLettreMalPlace();
    this.keyboard?.render();
  }

  private updateKeyboardLettreAbsente(): void {
    const lettresPresentes: string[] = Array.from(this.propositions.entries()).map(
      (propositionInfos: [number, [string, string]]) => {
        const proposition = propositionInfos[1][0];
        const validation = propositionInfos[1][1];
        return Array.from(proposition).filter(
          (lettre: string, index: number) => {
            return ['+', '-'].includes(validation[index])
          }
        );
      }
    ).flat()
    const lettresAbsentes: string[] = Array.from(this.propositions.entries()).map(
      (propositionInfos: [number, [string, string]]) => {
        const proposition = propositionInfos[1][0];
        const validation = propositionInfos[1][1];
        return Array.from(proposition).filter(
          (lettre: string, index: number) => {
            return !['+', '-'].includes(validation[index])
          }
        );
      }
    ).flat();

    const lettreVraimentAbsentes = lettresAbsentes.filter((lettre: string) => {
      return !lettresPresentes.includes(lettre);
    });

    this.keyboard?.addButtonTheme(ArrayUtils.removeDuplicates(lettreVraimentAbsentes).join(' ').toUpperCase(), 'motus-lettre-absente');
  }

  private updateKeyboardLettreBienPlace(): void {
    const lettresBienPlaces: string[] = Array.from(this.propositions.entries()).map(
      (propositionInfos: [number, [string, string]]) => {
        const proposition = propositionInfos[1][0];
        const validation = propositionInfos[1][1];
        return Array.from(proposition).filter(
          (lettre: string, index: number) => {
            return ['+'].includes(validation[index])
          }
        );
      }
    ).flat();

    this.keyboard?.addButtonTheme(ArrayUtils.removeDuplicates(lettresBienPlaces).join(' ').toUpperCase(), 'motus-lettre-bien-place');
  }

  private updateKeyboardLettreMalPlace(): void {
    const lettresBienPlaces: string[] = Array.from(this.propositions.entries()).map(
      (propositionInfos: [number, [string, string]]) => {
        const proposition = propositionInfos[1][0];
        const validation = propositionInfos[1][1];
        return Array.from(proposition).filter(
          (lettre: string, index: number) => {
            return ['+'].includes(validation[index])
          }
        );
      }
    ).flat();

    const lettresMalPlaces: string[] = Array.from(this.propositions.entries()).map(
      (propositionInfos: [number, [string, string]]) => {
        const proposition = propositionInfos[1][0];
        const validation = propositionInfos[1][1];
        return Array.from(proposition).filter(
          (lettre: string, index: number) => {
            return ['+', '-'].includes(validation[index])
          }
        );
      }
    ).flat()

    const lettreVraimentMalPlaces = lettresMalPlaces.filter((lettre: string) => {
      return !lettresBienPlaces.includes(lettre);
    });

    this.keyboard?.addButtonTheme(ArrayUtils.removeDuplicates(lettreVraimentMalPlaces).join(' ').toUpperCase(), 'motus-lettre-mal-place');
  }

  private getClassesFromValidation(validation: string): string[] {
    return Array.from(validation).map(
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
  }

  private loadResume(roundId: string): Observable<RoundEndSummaryDto | undefined> {
    return this.motusRoundService.load(
      roundId,
      this.isWin,
      Array.from(this.propositions.keys()).sort().map(
        (nbTry: number) => {
          return (this.propositions.get(nbTry) || ['', ''])[1]
        }
      )
    )
  }

  private loadClassement(roundId: string): Observable<MotusRoundRankDto[]> {
    return this.motusRoundClassementService.load(
      roundId
    )
  }
}
