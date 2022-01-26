import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeedLocalUserGuardService } from './core/need-local-user.guard.service';
import { HomeComponent } from './home/home.component';
import { MotusDailyGameRoundPlayerResolver } from './motus/motus-daily-game-round-player-resolver.service';
import { MotusRoundComponent } from './motus/motus-round/motus-round.component';

const routes: Routes = [{
  component: HomeComponent,
  path: ''
}, {
  component: MotusRoundComponent,
  canActivate: [
    NeedLocalUserGuardService
  ],
  resolve: {
    dailyGameRoundPlayerPropositions: MotusDailyGameRoundPlayerResolver
  },
  path: 'mot/daily'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
