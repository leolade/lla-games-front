import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MotusGameCreateParamsDto } from 'lla-party-games-dto/dist/motus-game-create-params.dto';
import { MotusGameDto } from 'lla-party-games-dto/dist/motus-game.dto';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MotusGameRepositoryService extends HttpService {

  constructor(
    protected override httpClient: HttpClient
  ) {
    super(httpClient, 'motus/game')
  }

  getDailyGame(): Observable<MotusGameDto> {
    return this.get<MotusGameDto>(`daily-game`);
  }

  createGame(param: MotusGameCreateParamsDto): Observable<MotusGameDto> {
    return this.post('create', param);
  }
}
