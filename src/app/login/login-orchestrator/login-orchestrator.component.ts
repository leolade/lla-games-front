import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-orchestrator',
  templateUrl: './login-orchestrator.component.html',
  styleUrls: ['./login-orchestrator.component.scss']
})
export class LoginOrchestratorComponent implements OnInit {

  state: 'LOGIN' | 'REGISTER' = 'LOGIN';

  constructor(
    private matDialogRef: MatDialogRef<LoginOrchestratorComponent, void>
  ) { }

  ngOnInit(): void {
  }

  switchToLogin(): void {
    this.state = 'LOGIN';
  }

  switchToRegister(): void {
    this.state = 'REGISTER';
  }

  onLogged(): void {
    this.matDialogRef.close();
  }
}
