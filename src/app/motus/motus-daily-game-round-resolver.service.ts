import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MotusGameDto } from 'lla-party-games-dto/dist/motus-game.dto';
import { MotusRoundDto } from 'lla-party-games-dto/dist/motus-round.dto';
import { MotusPlayerGameDto } from 'lla-party-games-dto/src/motus-player-game.dto';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { MotusGameRepositoryService } from '../repositories/motus-game-repository.service';
import { MotusRoundRepositoryService } from '../repositories/motus-round-repository.service';

@Injectable({
  providedIn: 'root'
})
export class MotusDailyGameRoundResolver implements Resolve<[MotusRoundDto, MotusPlayerGameDto]> {
  constructor(
    private motusRoundRepositoryService: MotusRoundRepositoryService,
    private motusGameRepositoryService: MotusGameRepositoryService,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<[MotusRoundDto, MotusPlayerGameDto]> | Promise<[MotusRoundDto, MotusPlayerGameDto]> | [MotusRoundDto, MotusPlayerGameDto] {
    return this.motusGameRepositoryService.getDailyGame()
      .pipe(
        switchMap(
          (game: MotusGameDto) => {
            return forkJoin([
              this.motusRoundRepositoryService.getRound(game.roundsId[0]),
              this.motusRoundRepositoryService.getDailyGameForUser()
            ]);
          }
        )
      );
  }
}