import { Clipboard } from "@angular/cdk/clipboard"
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RoundEndSummaryPointsDto } from 'lla-party-games-dto/dist/round-end-summary-points.dto';
import { RoundEndSummaryDto } from 'lla-party-games-dto/dist/round-end-summary.dto';

@Component({
  selector: 'app-resume-round',
  templateUrl: './motus-resume-round.component.html',
  styleUrls: ['./motus-resume-round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotusResumeRoundComponent implements OnInit, OnChanges {
  motADeviner: string = ``;
  propositionHTML: SafeHtml | null = null;
  detailsPoints: string = '';

  @Input() reussi: boolean | undefined | null = false;
  @Input() validationsPropositions: string[] | null = [];
  @Input() summary: RoundEndSummaryDto | undefined | null;

  constructor(
    private domSanitizer: DomSanitizer,
    private clipboard: Clipboard
  ) {
  }

  ngOnInit(): void {
    this.onValidationsPropositionsChanged();
    this.onSummaryChanged();
  }

  onPartagerClickHandler(): void {
    this.clipboard.copy(
      `Motus de : http://www.game.leoladevie.fr/mot/daily \n\n` +
      this.getEmojisFromProposition(this.validationsPropositions || []).join('\n')
      + `\nJ'ai obtenu ${this.summary?.totalPoints} points`
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['validationsPropositions']) {
      this.onValidationsPropositionsChanged();
    }
    if (changes?.['summary']) {
      this.onSummaryChanged();
    }
  }

  private generatePropositionHTML(validationsPropositions: string[]): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(`<p>` +
      this.getEmojisFromProposition(validationsPropositions).join('<br>') + `</p>`);
  }

  private getEmojisFromProposition(validationsPropositions: string[]): string[] {
    return validationsPropositions.map(
      (validationProposition: string) => {
        return Array.from(validationProposition).map(
          (lettre: string) => {
            switch (lettre) {
              case '+':
                return `🟩`
              case '-':
                return `🟨`;
              default:
                return `⬛`;
            }
          }
        ).join('')
      }
    )
  }

  private onValidationsPropositionsChanged(): void {
    this.propositionHTML = this.generatePropositionHTML(this.validationsPropositions || [])
  }

  private onSummaryChanged(): void {
    this.motADeviner = this.summary?.word || '';
    this.detailsPoints = (this.summary?.points || []).map(
      (detailPoint: RoundEndSummaryPointsDto) => {
        return `${detailPoint.points} points : ${detailPoint.description}`
      }
    ).join('\n');
  }
}

export interface IMotusResumeRoundDialogOptions {
  reussi: boolean;
  validationsPropositions: string[];
  summary: RoundEndSummaryDto | undefined;
}