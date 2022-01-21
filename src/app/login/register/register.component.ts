import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, take } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loginFC: FormControl = new FormControl(null,  [Validators.required]);
  passwordFC: FormControl = new FormControl(null,  [Validators.required]);
  submitPending: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {

    this.registerForm = formBuilder.group({
      login: this.loginFC,
      password: this.passwordFC,
    })

  }

  ngOnInit(): void {
  }

  onRegisterSubmitted($event: Event): void {
    this.removeLoginAlreadyUsedError();
    if (this.registerForm.invalid) {
      console.debug(`Le formulaire n'est pas valide, on ne le soumet pas.`)
      return;
    }
    this.submitPending = true;
    this.loginService.register(this.loginFC.value, this.passwordFC.value).subscribe(
      () => {
        this.submitPending = false;
      },
      () => {
        this.loginFC.setErrors({'loginAlreadyUsed': true});
        merge(this.loginFC.valueChanges, this.passwordFC.valueChanges).pipe(take(1)).subscribe(() => {
          this.removeLoginAlreadyUsedError();
        })
        this.submitPending = false;
      }
    )
  }

  private removeLoginAlreadyUsedError(): void {
    this.loginFC.setErrors({'loginAlreadyUsed': null});
    this.loginFC.updateValueAndValidity();
  }

}
