import { Injectable } from '@angular/core';
import { MotusRoundRankDto } from 'lla-party-games-dto/dist/motus-round-rank.dto';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { MotusRoundRepositoryService } from '../../repositories/motus-round-repository.service';

@Injectable({
  providedIn: 'root'
})
export class MotusRoundClassementService {

  classement$: Observable<MotusRoundRankDto[]>
  private classementSubject = new BehaviorSubject<MotusRoundRankDto[]>([]);

  constructor(private motusRoundRepositoryService: MotusRoundRepositoryService) {
    this.classement$ = this.classementSubject.asObservable();
  }

  resetClassement(): void {
    this.classementSubject.next([]);
  }

  load(roundId: string): Observable<MotusRoundRankDto[]> {
    return this.motusRoundRepositoryService.getClassementRound(roundId)
      .pipe(
        catchError(() => of([])),
        tap((value: MotusRoundRankDto[]) => this.setClassement(value))
      )
  }

  private setClassement(summary: MotusRoundRankDto[]): void {
    this.classementSubject.next(summary);
  }
}
