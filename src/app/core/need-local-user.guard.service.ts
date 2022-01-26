import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LocalUserDto } from 'lla-party-games-dto/dist/local-user.dto';
import { UserDto } from 'lla-party-games-dto/dist/user.dto';
import { filter, map, Observable } from 'rxjs';
import { ObjectUtils } from 'type-script-utils-lla/dist/object.utils';
import { LocalUserService } from './local-user.service';

@Injectable({
  providedIn: 'root'
})
export class NeedLocalUserGuardService  implements CanActivate {

  constructor(private localUserService: LocalUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.localUserService.getLocalUser()?.uuid) {
      return true;
    }
    return this.localUserService.localUserUuid$.pipe(
      filter((user: UserDto | undefined) => {
        return ObjectUtils.isNotNil(user);
      }),
      map(() => true)
    )
  }

}
