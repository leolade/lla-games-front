import { Injectable } from '@angular/core';
import { ConnectedUserDto } from 'lla-party-games-dto/dist/connected-user.dto';
import { UserDto } from 'lla-party-games-dto/dist/user.dto';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { UsersRepository } from '../repositories/users-repository.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<ConnectedUserDto | undefined | null>;
  private USER_UUID_LOCAL_STORAGE: string = 'LLAGAMES:USER_UUID';
  private userSubject: BehaviorSubject<ConnectedUserDto | undefined | null> = new BehaviorSubject<ConnectedUserDto | undefined | null>(undefined)

  constructor(
    private userRepository: UsersRepository,
    private authService: AuthService,
  ) {
    this.user$ = this.userSubject.asObservable();
  }

  whoAmI(): Observable<UserDto> {
    return this.userRepository.whoAmI();
  }

  getOrCreateToken(): Observable<ConnectedUserDto> {
    const token: string | null = this.authService.getCurrentToken();
    let getOrCreateTokenObservable: Observable<ConnectedUserDto> = this.getOrCreateTokenByUserId();

    if (token) {
      getOrCreateTokenObservable = this.getUserByToken(token).pipe(
        catchError(() => {
          return this.getOrCreateTokenByUserId();
        })
      );
    }

    return getOrCreateTokenObservable.pipe(
      tap((user: ConnectedUserDto) => {
        if (this.getLocalStorageUserUuid() !== user.uuid) {
          this.setLocalUserUuid(user.uuid);
        }
        if (this.authService.getCurrentToken() !== user?.token) {
          this.setUser(user);
        }
      })
    )

  }

  setUser(user: ConnectedUserDto): void {
    this.userSubject.next(user);
    this.authService.setToken(user.token);
  }

  private setLocalUserUuid(localUserUuid: string): void {
    localStorage.setItem(this.USER_UUID_LOCAL_STORAGE, localUserUuid);
  }

  private getLocalStorageUserUuid(): string | null {
    return localStorage.getItem(this.USER_UUID_LOCAL_STORAGE);
  }

  private createUser(): Observable<ConnectedUserDto> {
    return this.userRepository.createUser()
      .pipe(
        switchMap((userId: string) => {
          return this.getUserById(userId);
        })
      )
  }

  private getUserById(userId: string): Observable<ConnectedUserDto> {
    return this.userRepository.getUser(userId)
      .pipe(tap((user: ConnectedUserDto) => {
        this.setUser(user);
      }));
  }

  private getUserByToken(token: string): Observable<ConnectedUserDto> {
    return forkJoin([
      this.whoAmI(),
      of(token)
    ]).pipe(
      map(([user, token]: [UserDto, string]) => {
        return {
          ...user,
          token: token,
        };
      })
    )
  }

  private getOrCreateTokenByUserId(): Observable<ConnectedUserDto> {
    const userId: string | null = this.getLocalStorageUserUuid();
    if (!userId || userId == 'undefined') {
      return this.createUser();
    } else {
      return this.getUserById(userId);
    }
  }

  saveUsername(value: any): Observable<UserDto> {
    return this.userRepository.updateUsername({username: value});
  }
}
