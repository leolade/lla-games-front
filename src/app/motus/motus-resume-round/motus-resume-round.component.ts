import { Clipboard } from "@angular/cdk/clipboard"
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-resume-round',
  templateUrl: './motus-resume-round.component.html',
  styleUrls: ['./motus-resume-round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotusResumeRoundComponent implements OnInit {
  motADeviner: string;
  reussi: boolean;
  validationsPropositions: string[];
  propositionHTML: SafeHtml | null;

  constructor(
    private matDialogRef: MatDialogRef<MotusResumeRoundComponent, void>,
    private domSanitizer: DomSanitizer,
    private clipboard: Clipboard,
    @Inject(MAT_DIALOG_DATA) public data: IMotusResumeRoundDialogOptions
  ) {
    this.motADeviner = data.motADeviner;
    this.reussi = data.reussi;
    this.validationsPropositions = data.validationsPropositions;
    this.propositionHTML = this.generatePropositionHTML(this.validationsPropositions);
  }

  ngOnInit(): void {
  }

  close(): void {
    this.matDialogRef.close();
  }

  onPartagerClickHandler(): void {
    this.clipboard.copy(
      `Motus de : http://www.game.leoladevie.fr/mot/daily \n\n` +
      this.getEmojisFromProposition(this.validationsPropositions).join('\n')
    );
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
}

export interface IMotusResumeRoundDialogOptions {
  motADeviner: string;
  reussi: boolean;
  validationsPropositions: string[];
}