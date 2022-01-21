import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { UserDto } from '../../models/dtos/user.dto';
import { AuthService } from '../core/auth.service';
import { UsersRepository } from '../repositories/users-repository.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {
  }

  connect(login: string, password: string): Observable<any> {
    return this.usersRepository.connect(login, password);
  }

  register(login: string, password: string): Observable<any> {
    return this.usersRepository.register(login, password);
  }

  updateCurrentUser(): Observable<UserDto> {
    return this.whoAmI()
      .pipe(
        tap((user: UserDto) => this.authService.currentUser.next(user))
      )
  }

  whoAmI(): Observable<UserDto> {
    return this.usersRepository.whoAmI();
  }
}
