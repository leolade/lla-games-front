import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MotusMotInputComponent } from './motus-mot-input/motus-mot-input.component';
import { MotusRoundComponent } from './motus-round/motus-round.component';
import { MotusResumeRoundComponent } from './motus-resume-round/motus-resume-round.component';
import {AppModule} from "../app.module";
import {SharedModule} from "../shared/shared.module";


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
  ]
})
export class MotusModule {
}
