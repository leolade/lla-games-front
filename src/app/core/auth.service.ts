import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor() {
  }

  getCurrentToken(): string | null {
    return this.currentTokenSubject.getValue();
  }

  setToken(token: string): void {
    this.currentTokenSubject.next(token);
  }
}
