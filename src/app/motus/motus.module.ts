import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from "../shared/shared.module";
import { MotusMotInputComponent } from './motus-mot-input/motus-mot-input.component';
import { MotusResumeRoundComponent } from './motus-resume-round/motus-resume-round.component';
import { MotusRoundComponent } from './motus-round/motus-round.component';


@NgModule({
  declarations: [MotusRoundComponent,
    MotusMotInputComponent,
    MotusResumeRoundComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    ClipboardModule,
    SharedModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class MotusModule {
}
