import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MotusPlayerGameDto } from 'lla-party-games-dto/dist/motus-player-game.dto';
import { Observable } from 'rxjs';
import { LocalUserService } from '../core/local-user.service';
import { MotusRoundRepositoryService } from '../repositories/motus-round-repository.service';

@Injectable({
  providedIn: 'root'
})
export class MotusDailyGameRoundPlayerResolver implements Resolve<MotusPlayerGameDto> {
  constructor(
    private motusRoundRepositoryService: MotusRoundRepositoryService,
    private localUserService: LocalUserService,
    ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<MotusPlayerGameDto> | Promise<MotusPlayerGameDto> | MotusPlayerGameDto {
    return this.motusRoundRepositoryService.getDailyGameForUser(this.localUserService.getLocalUser().uuid);
  }
}