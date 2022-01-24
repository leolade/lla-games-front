import { Injectable } from '@angular/core';
import { UserDto } from 'lla-party-games-dto/dist/user.dto';
import { BehaviorSubject, of, switchMap, tap, throwError } from 'rxjs';
import { UsersRepository } from '../repositories/users-repository.service';

@Injectable({
  providedIn: 'root'
})
export class LocalUserService {

  private LOCAL_USER_UUID_LOCAL_STORAGE: string = 'LLAGAMES:LOCAL_USER_UUID';
  private localUserUuidSubject: BehaviorSubject<UserDto | undefined> = new BehaviorSubject<UserDto | undefined>(undefined);

  constructor(
    private userRepository: UsersRepository
  ) {
    let localUserUuid: string | null = this.getLocalUserUuid();
    let tokenObservable = of(localUserUuid);
    if (!localUserUuid) {
      tokenObservable = this.userRepository.getUnloggedToken().pipe(tap((token: string) => {
        if (token) {
          this.setLocalUserUuid(token);
        }
      }));
    }
    tokenObservable
      .pipe(
        switchMap((token: string | null) => {
          if (!token) {
            return throwError(() => new Error("Le token n'a pas été renvoyé."))
          }
          return this.userRepository.getUnloggedUser(token);
        })
      )
      .subscribe((user: UserDto) => {
          this.localUserUuidSubject.next(user);
        }
      );
  }

  private setLocalUserUuid(localUserUuid: string): void {
    localStorage.setItem(this.LOCAL_USER_UUID_LOCAL_STORAGE, localUserUuid);
  }

  private getLocalUserUuid(): string | null {
    return localStorage.getItem(this.LOCAL_USER_UUID_LOCAL_STORAGE);
  }

  getLocalUser(): UserDto {
    return this.localUserUuidSubject.getValue() as UserDto;
  }
}
