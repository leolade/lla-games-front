import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectUserDto } from 'lla-party-games-dto/dist/connect-user.dto';
import { CreateUserDto } from 'lla-party-games-dto/dist/create-user.dto';
import { UserDto } from 'lla-party-games-dto/dist/user.dto';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UsersRepository extends HttpService {

  constructor(
    private authService: AuthService,
    protected override httpClient: HttpClient
  ) {
    super(httpClient, 'users')
  }

  connect(login: string, password: string): Observable<string> {
    return this.postText<ConnectUserDto>('login', {
      username: login,
      password: password
    }).pipe(tap((token: string) => this.authService.currentToken.next(token)))
  }

  register(login: string, password: string): Observable<string> {
    return this.postText<CreateUserDto>('register', {
      username: login,
      password: password,
      uuid: '',
    }).pipe(tap((token: string) => this.authService.currentToken.next(token)))
  }

  whoAmI(): Observable<UserDto> {
    return this.get<UserDto>('who-am-i')
  }

  getUnloggedToken(): Observable<string> {
    return this.getText(`unlogged-token`);
  }

  getUnloggedUser(token: string): Observable<UserDto> {
    return this.get(`unlogged-user/${token}`);
  }
}
