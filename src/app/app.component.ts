import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDto } from 'lla-party-games-dto/dist/user.dto';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './core/auth.service';
import { AppLoader, LoaderService } from './core/loader.service';
import { LoginOrchestratorComponent } from './login/login-orchestrator/login-orchestrator.component';
import {LoginService} from './login/login.service';
import {FormControl} from "@angular/forms";
import {DarkModeService} from "./core/dark-mode.service";

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
  darkModeFC: FormControl = new FormControl(this.darkModeService.getDarkMode());

  constructor(private authService: AuthService, private loginService: LoginService, private dialog: MatDialog,
              private loaderService: LoaderService, private darkModeService: DarkModeService) {
    this.currentUser$ = this.authService.currentUser.asObservable();
    this.loader$ = this.loaderService.loader$;
    if (this.authService.currentToken.getValue()) {
      this.loginService.updateCurrentUser().subscribe()
    }

    this.darkModeFC.valueChanges.subscribe(
      (value: boolean) => {
        this.darkModeService.updateDarkMode(value);
      }
    )
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
