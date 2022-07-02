import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MotusPlayerGameDto } from 'lla-party-games-dto/dist/motus-player-game.dto';
import { MotusRoundPropositionValidationDto } from 'lla-party-games-dto/dist/motus-round-proposition-validation.dto';
import { MotusRoundPropositionDto } from 'lla-party-games-dto/dist/motus-round-proposition.dto';
import { MotusRoundRankDto } from 'lla-party-games-dto/dist/motus-round-rank.dto';
import { MotusRoundDto } from 'lla-party-games-dto/dist/motus-round.dto';
import { RoundEndSummaryDto } from 'lla-party-games-dto/dist/round-end-summary.dto';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MotusRoundRepositoryService extends HttpService {

  constructor(
    protected override httpClient: HttpClient
  ) {
    super(httpClient, 'motus/round')
  }

  getRound(roundId: string): Observable<MotusRoundDto> {
    return this.get(`${roundId}`);
  }

  makeProposition(roundId: string, proposition: MotusRoundPropositionDto): Observable<MotusRoundPropositionValidationDto> {
    return this.post<MotusRoundPropositionValidationDto, MotusRoundPropositionDto>(`${roundId}/proposition`, proposition);
  }

  getPoints(roundId: string): Observable<RoundEndSummaryDto> {
    return this.get(`points/${roundId}`);
  }

  getDailyGameForUser(): Observable<MotusPlayerGameDto> {
    return this.get(`game/daily`);
  }

  getClassementRound(roundId: string): Observable<MotusRoundRankDto[]> {
    return this.get(`${roundId}/classement`);
  }
}
