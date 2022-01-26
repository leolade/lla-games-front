import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MotusPlayerGameDto } from 'lla-party-games-dto/dist/motus-player-game.dto';
import { MotusRoundPropositionValidationDto } from 'lla-party-games-dto/dist/motus-round-proposition-validation.dto';
import { MotusRoundPropositionDto } from 'lla-party-games-dto/dist/motus-round-proposition.dto';
import { MotusRoundDto } from 'lla-party-games-dto/dist/motus-round.dto';
import { RoundEndSummaryDto } from 'lla-party-games-dto/dist/round-end-summary.dto';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MotusRoundRepositoryService extends HttpService {

  constructor(
    private authService: AuthService,
    protected override httpClient: HttpClient
  ) {
    super(httpClient, 'motus/round')
  }

  getRound(roundId: string): Observable<MotusRoundDto> {
    return this.get(`${roundId}`);
  }

  makeProposition(roundId: string, proposition: MotusRoundPropositionDto): Observable<MotusRoundPropositionValidationDto> {
    return this.post<MotusRoundPropositionValidationDto, MotusRoundPropositionDto>(`${roundId}/proposition/unlogged`, proposition);
  }

  getPointsRoundUnloggedUser(roundId: string, userId: string): Observable<RoundEndSummaryDto> {
    return this.get(`points/unlogged/${roundId}/${userId}`);
  }

  getDailyGameForUser(userId: string): Observable<MotusPlayerGameDto> {
    return this.get(`${userId}/rounds`);
  }
}
