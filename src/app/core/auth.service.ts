import { Injectable } from '@angular/core';
import { UserDto } from 'lla-party-games-dto/dist/user.dto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: BehaviorSubject<UserDto | null> = new BehaviorSubject<UserDto | null>(null);
  currentToken: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private LOCAL_STARGE_TOKEN_KEY: string = "party_game_jwt_token"

  constructor() {
    const previousSessionToken: string | null = localStorage.getItem((this.LOCAL_STARGE_TOKEN_KEY));
    if (previousSessionToken) {
      this.currentToken.next(previousSessionToken);
    }
    this.currentToken.asObservable().subscribe(
      (token: string | null) => {
        if (token) {
          localStorage.setItem(this.LOCAL_STARGE_TOKEN_KEY, token);
        } else {
          localStorage.removeItem(this.LOCAL_STARGE_TOKEN_KEY);
        }
    }
    )
  }

  logout(): void {
    this.currentUser.next(null);
    this.currentToken.next(null);
  }
}
