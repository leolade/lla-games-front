import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserDto } from '../models/dtos/user.dto';
import { AuthService } from './core/auth.service';
import { AppLoader, LoaderService } from './core/loader.service';
import { LoginOrchestratorComponent } from './login/login-orchestrator/login-orchestrator.component';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PartyGamesFront';

  currentUser$: Observable<UserDto | null>;
  loader$: Observable<AppLoader<any> | null>;
  isProd: boolean = environment.production;

  constructor(private authService: AuthService, private loginService: LoginService, private dialog: MatDialog,
              private loaderService: LoaderService) {
    this.currentUser$ = this.authService.currentUser.asObservable();
    this.loader$ = this.loaderService.loader$;
    if (this.authService.currentToken.getValue()) {
      this.loginService.updateCurrentUser().subscribe()
    }
  }

  onLoginClicked(): void {
    this.dialog.open(
      LoginOrchestratorComponent
    )
  }

  seDeconnecterClickHandler(): void {
    this.authService.logout();
  }

  onJouerMotDuJourClickHandler(): void {

  }
}
