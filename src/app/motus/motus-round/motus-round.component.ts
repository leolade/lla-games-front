import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Data } from '@angular/router';
import { MotusGameDto } from 'lla-party-games-dto/dist/motus-game.dto';
import { MotusPlayerPropositionValideDto } from 'lla-party-games-dto/dist/motus-player-proposition-valide.dto';
import { MotusRoundDto } from 'lla-party-games-dto/dist/motus-round.dto';
import { RoundEndSummaryDto } from 'lla-party-games-dto/dist/round-end-summary.dto';
import { MotusPlayerGameDto } from 'lla-party-games-dto/src/motus-player-game.dto';
import { forkJoin, interval, map, Observable, of, switchMap, take, tap } from 'rxjs';
import Keyboard from 'simple-keyboard';
import { ArrayUtils } from 'type-script-utils-lla/dist/array.utils';
import { DarkModeService } from '../../core/dark-mode.service';
import { LocalUserService } from '../../core/local-user.service';
import { KeyboardEventService } from '../../keyboard-event.service';
import { MotRepositoryService } from '../../repositories/mot-repository.service';
import { MotusGameRepositoryService } from '../../repositories/motus-game-repository.service';
import { MotusRoundRepositoryService } from '../../repositories/motus-round-repository.service';
import { MotusMotInputComponent } from '../motus-mot-input/motus-mot-input.component';
import {
  IMotusResumeRoundDialogOptions,
  MotusResumeRoundComponent
} from '../motus-resume-round/motus-resume-round.component';

@Component({
  selector: 'app-motus-round',
  templateUrl: './motus-round.component.html',
  styleUrls: ['./motus-round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotusRoundComponent implements OnInit, AfterViewInit {

  LETTRE_BIEN_PLACE_CLASS = 'well-placed-letter'
  LETTRE_MAL_PLACE_CLASS = 'misplaced-letter'
  LETTRE_MAUVAISE_CLASS = 'bad-letter'

  @ViewChildren('motusMotInputComponent') inputs: QueryList<MotusMotInputComponent> = new QueryList<MotusMotInputComponent>();

  nbTry: number = 6;
  nbTryArray: number[] = Array.from(Array(this.nbTry).keys())
  validations: boolean[] = Array(this.nbTry).fill(false);
  keyboard: Keyboard | undefined;
  nbTryActive: number = 0;
  round$: Observable<MotusRoundDto>;
  isWin: boolean = false;
  isLoose: boolean = false;
  validationsClassInitialised: string[][] = [];
  preFilledWordInitialised: string[] = [];
  readonly: boolean = false;

  private roundCourant?: MotusRoundDto;
  private propositions: Map<number, [string, string]> = new Map()

  constructor(
    private keyboardEventService: KeyboardEventService,
    private motRepository: MotRepositoryService,
    private motusGameRepositoryService: MotusGameRepositoryService,
    private motusRoundRepositoryService: MotusRoundRepositoryService,
    private localUserService: LocalUserService,
    private darkModeService: DarkModeService,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this.route.data.subscribe(
      (data: Data) => {
        if (data['dailyGameRoundPlayerPropositions']) {
          const dailyGameRoundPlayerPropositions: MotusPlayerGameDto = data['dailyGameRoundPlayerPropositions'];
          this.validationsClassInitialised = []
          this.preFilledWordInitialised = []
          this.readonly = dailyGameRoundPlayerPropositions.readonly || false;
          dailyGameRoundPlayerPropositions.propositionsValides.forEach(
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
      }
    )
    this.round$ = this.motusGameRepositoryService.getDailyGame()
      .pipe(
        switchMap(
          (game: MotusGameDto) => {
            return this.motusRoundRepositoryService.getRound(game.roundsId[0]);
          }
        ),
        tap((round: MotusRoundDto) => this.roundCourant = round)
      );
  }

  /**
   * On écoute toutes les touches tapés par l'utilisateur pour les reporter sur la grille de jeu.
   * @param $event
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown($event: KeyboardEvent) {
    if (!this.readonly) {
      if (this.keyboardEventService.isLetterKeyboardEvent($event)) {
        this.setNextLetter($event.key);
      } else if (this.keyboardEventService.isDeleteKeyboardEvent($event)) {
        this.erasePreviousLetter();
      } else if (this.keyboardEventService.isEnterKeyboardEvent($event)) {
        this.validateMot();
      }
    }
  }

  ngOnInit(): void {
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
          '{enter}': '↵ Entrée'
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
      this.isWin = isMotTrouve;
      this.nbTryActive = -1;

      forkJoin([
        interval(MotusMotInputComponent.TEMPS_ANIMATION_REVELATION_LETTRE * (proposition.length + 1)).pipe(take(1)),
        this.roundCourant ?
          this.motusRoundRepositoryService.getPointsRoundUnloggedUser(this.roundCourant.roundId, this.localUserService.getLocalUser().uuid) :
          of(undefined)
      ]).pipe(
        map(
          ([n, summary]: [number, RoundEndSummaryDto | undefined]) => {
            return summary
          }
        )
      ).subscribe(
        (summary: RoundEndSummaryDto | undefined) => {
          this.voirResume(summary);
        }
      )
    } else {
      this.nbTryActive += 1;
    }
  }

  applyInputValidityClasses(input: MotusMotInputComponent, classes: string[], interval: Observable<number>): void {
    input.applyValidationClass(classes, interval);
  }

  voirLeResumeClickHandler(): void {
    const o: Observable<RoundEndSummaryDto | undefined>  = this.roundCourant
      ? this.motusRoundRepositoryService.getPointsRoundUnloggedUser(this.roundCourant.roundId, this.localUserService.getLocalUser().uuid)
      : of(undefined);
    o.pipe()
      .subscribe(
      {
        next: (summary: RoundEndSummaryDto | undefined) => {
          this.voirResume(summary);
        }
      }
    )
  }

  private voirResume(summary: RoundEndSummaryDto | undefined): void {
    this.matDialog.open<MotusResumeRoundComponent, IMotusResumeRoundDialogOptions>(
      MotusResumeRoundComponent, {
        panelClass: ['dark-theme'],
        data: {
          summary: summary,
          reussi: this.isWin,
          validationsPropositions: Array.from(this.propositions.keys()).sort().map(
            (nbTry: number) => {
              return (this.propositions.get(nbTry) || ['', ''])[1]
            }
          )
        } as IMotusResumeRoundDialogOptions
      }
    );
  }

  private onKeyPress(button: string): any {
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
      ([nbTry, [proposition, validation]]: [number, [string, string]]) => {
        return Array.from(proposition).filter(
          (lettre: string, index: number) => {
            return ['+', '-'].includes(validation[index])
          }
        );
      }
    ).flat()
    const lettresAbsentes: string[] = Array.from(this.propositions.entries()).map(
      ([nbTry, [proposition, validation]]: [number, [string, string]]) => {
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
      ([nbTry, [proposition, validation]]: [number, [string, string]]) => {
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
      ([nbTry, [proposition, validation]]: [number, [string, string]]) => {
        return Array.from(proposition).filter(
          (lettre: string, index: number) => {
            return ['+'].includes(validation[index])
          }
        );
      }
    ).flat();

    const lettresMalPlaces: string[] = Array.from(this.propositions.entries()).map(
      ([nbTry, [proposition, validation]]: [number, [string, string]]) => {
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
    ;
  }
}
