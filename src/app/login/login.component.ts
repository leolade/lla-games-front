import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, switchMap, take } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFC: FormControl = new FormControl(null, [Validators.required]);
  passwordFC: FormControl = new FormControl(null, [Validators.required]);
  submitPending: boolean = false;

  @Output() logged: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {

    this.loginForm = formBuilder.group({
      login: this.loginFC,
      password: this.passwordFC,
    })

  }

  ngOnInit(): void {
  }

  onLoginSubmitted($event: Event): void {
    this.removeInvalidLoginOrPasswordError();
    if (this.loginForm.invalid) {
      console.debug(`Le formulaire n'est pas valide, on ne le soumet pas.`)
      return;
    }
    this.submitPending = true;
    this.loginService
      .connect(this.loginFC.value, this.passwordFC.value)
      .pipe(
        switchMap(
          () => {
            return this.loginService.updateCurrentUser();
          },
        )
      )
      .subscribe({
        next: () => {
          this.submitPending = false;
          this.logged.emit();
        },
        error: (error: any) => {
          this.loginFC.setErrors({'loginOrPasswordInvalid': true});
          merge(this.loginFC.valueChanges, this.passwordFC.valueChanges).pipe(take(1)).subscribe(() => {
            this.removeInvalidLoginOrPasswordError();
          })
          this.submitPending = false;
        }
      })
  }

  private removeInvalidLoginOrPasswordError(): void {
    this.loginFC.setErrors({'loginOrPasswordInvalid': null});
    this.loginFC.updateValueAndValidity();
  }
}
