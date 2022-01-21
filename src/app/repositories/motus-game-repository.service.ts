import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MotusGameDto } from 'lla-party-games-dto/dist/motus-game.dto';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MotusGameRepositoryService extends HttpService {

  constructor(
    private authService: AuthService,
    protected override httpClient: HttpClient
  ) {
    super(httpClient, 'motus/game')
  }

  getDailyGame(): Observable<MotusGameDto> {
    return this.get<MotusGameDto>(`daily-game`);
  }
}
