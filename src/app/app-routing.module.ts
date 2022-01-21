import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MotusRoundComponent } from './motus/motus-round/motus-round.component';

const routes: Routes = [{
  component: HomeComponent,
  path: ''
}, {
  component: MotusRoundComponent,
  path: 'mot/daily'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
