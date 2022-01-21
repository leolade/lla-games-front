import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register/register.component';
import { LoginOrchestratorComponent } from './login-orchestrator/login-orchestrator.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LoginOrchestratorComponent
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    LoginOrchestratorComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class LoginModule { }
