import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from "../shared/shared.module";
import { MotusGameOrchestratorComponent } from './motus-game-orchestrator/motus-game-orchestrator.component';
import { MotusLobbyGameComponent } from './motus-lobby-game/motus-lobby-game.component';
import { MotusMotInputComponent } from './motus-mot-input/motus-mot-input.component';
import { MotusResumeRoundComponent } from './motus-resume-round/motus-resume-round.component';
import { MotusRoundComponent } from './motus-round/motus-round.component';
import { MotusRankingComponent } from './motus-ranking/motus-ranking.component';


@NgModule({
  declarations: [MotusRoundComponent,
    MotusMotInputComponent,
    MotusResumeRoundComponent,
    MotusGameOrchestratorComponent,
    MotusLobbyGameComponent,
    MotusRankingComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    ClipboardModule,
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
  ]
})
export class MotusModule {
}
