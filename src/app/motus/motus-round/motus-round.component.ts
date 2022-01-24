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
import { MotusGameDto } from 'lla-party-games-dto/dist/motus-game.dto';
import { Observable, switchMap, tap } from 'rxjs';
import Keyboard from 'simple-keyboard';
import { ArrayUtils } from 'type-script-utils-lla/dist/array.utils';
import { DarkModeService } from '../../core/dark-mode.service';
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


  @ViewChildren('motusMotInputComponent') inputs: QueryList<MotusMotInputComponent> = new QueryList<MotusMotInputComponent>();

  nbTry: number = 6;
  nbTryArray: number[] = Array.from(Array(this.nbTry).keys())
  validations: boolean[] = Array(this.nbTry).fill(false);
  keyboard: Keyboard | undefined;
  nbTryActive: number = 0;
  motADeviner$: Observable<string>;
  isWin: boolean = false;
  isLoose: boolean = false;

  private motADevinerCourant?: string;
  private propositions: Map<number, [string, string]> = new Map()

  constructor(
    private keyboardEventService: KeyboardEventService,
    private motRepository: MotRepositoryService,
    private motusGameRepositoryService: MotusGameRepositoryService,
    private motusRoundRepositoryService: MotusRoundRepositoryService,
    private darkModeService: DarkModeService,
    private matDialog: MatDialog,
  ) {
    this.motADeviner$ = this.motusGameRepositoryService.getDailyGame()
      .pipe(
        switchMap(
          (game: MotusGameDto) => {
            return this.motusRoundRepositoryService.getRoundWord(game.roundsId[0]);
          }
        ),
        tap((motADeviner: string) => this.motADevinerCourant = motADeviner)
      );
  }

  /**
   * On écoute toutes les touches tapés par l'utilisateur pour les reporter sur la grille de jeu.
   * @param $event
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown($event: KeyboardEvent) {
    if (this.keyboardEventService.isLetterKeyboardEvent($event)) {
      this.setNextLetter($event.key);
    } else if (this.keyboardEventService.isDeleteKeyboardEvent($event)) {
      this.erasePreviousLetter();
    } else if (this.keyboardEventService.isEnterKeyboardEvent($event)) {
      this.validateMot();
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
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
  }

  onValidateMot([proposition, validation]: [string, string], i: number): void {
    this.propositions.set(i, [proposition, validation]);
    this.updateKeyboardDisabledButton();
    this.validations[i] = true;
    const isMotTrouve: boolean = Array.from(validation).findIndex((lettre: string) => lettre != '+') === -1;
    const isLastTry: boolean = i === this.nbTry;

    // Si la partie s'arrête
    if (isMotTrouve || isLastTry) {
      this.isWin = isMotTrouve;
      this.nbTryActive = -1;

      // On ouvre la fenêtre de résumé après l'animation de révélation des lettres
      setTimeout(() => {
        this.matDialog.open<MotusResumeRoundComponent, IMotusResumeRoundDialogOptions>(
          MotusResumeRoundComponent, {
            data: {
              motADeviner: this.motADevinerCourant,
              reussi: this.isWin,
              validationsPropositions: Array.from(this.propositions.keys()).sort().map(
                (nbTry: number) => {
                  return (this.propositions.get(nbTry) || ['', ''])[1]
                }
              )
            } as IMotusResumeRoundDialogOptions
          }
        );
      }, MotusMotInputComponent.TEMPS_ANIMATION_REVELATION_LETTRE * (proposition.length + 1)
      );
    } else {
      this.nbTryActive += 1;
    }
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
      ([nbTry, [proposition, validation]]:[number, [string, string]]) => {
        return Array.from(proposition).filter(
          (lettre: string, index: number) => {
            return ['+', '-'].includes(validation[index])
          }
        );
      }
    ).flat()
    const lettresAbsentes: string[] = Array.from(this.propositions.entries()).map(
      ([nbTry, [proposition, validation]]:[number, [string, string]]) => {
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
      ([nbTry, [proposition, validation]]:[number, [string, string]]) => {
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
      ([nbTry, [proposition, validation]]:[number, [string, string]]) => {
        return Array.from(proposition).filter(
          (lettre: string, index: number) => {
            return ['+'].includes(validation[index])
          }
        );
      }
    ).flat();

    const lettresMalPlaces: string[] = Array.from(this.propositions.entries()).map(
      ([nbTry, [proposition, validation]]:[number, [string, string]]) => {
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
}
