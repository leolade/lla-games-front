import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeedLocalUserGuardService } from './core/need-local-user.guard.service';
import { HomeComponent } from './home/home.component';
import { MotusDailyGameRoundResolver } from './motus/motus-daily-game-round-resolver.service';
import { MotusGameOrchestratorComponent } from './motus/motus-game-orchestrator/motus-game-orchestrator.component';
import { MotusLobbyGameComponent } from './motus/motus-lobby-game/motus-lobby-game.component';
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
    round: MotusDailyGameRoundResolver,
  },
  path: 'mot/daily'
}, {
  path: 'game',
  children: [
    {
      path: 'create',
      component: MotusLobbyGameComponent
    },
    {
      path: ':id',
      component: MotusGameOrchestratorComponent
    },
  ],
  canActivateChild: [
    NeedLocalUserGuardService
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
