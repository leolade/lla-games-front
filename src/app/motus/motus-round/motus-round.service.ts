import { Injectable } from '@angular/core';
import { RoundEndSummaryDto } from 'lla-party-games-dto/dist/round-end-summary.dto';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { MotusRoundRepositoryService } from '../../repositories/motus-round-repository.service';

@Injectable({
  providedIn: 'root'
})
export class MotusRoundService {

  resume$: Observable<RoundEndSummaryDto | undefined>
  private resumeSubject = new BehaviorSubject<RoundEndSummaryDto | undefined>(undefined);
  propositions$: Observable<string[]>
  private propositionsSubject = new BehaviorSubject<string[]>([]);
  win$: Observable<boolean | undefined>
  private winSubject = new BehaviorSubject<boolean | undefined>(undefined);

  constructor(private motusRoundRepositoryService: MotusRoundRepositoryService) {
    this.resume$ = this.resumeSubject.asObservable();
    this.propositions$ = this.propositionsSubject.asObservable();
    this.win$ = this.winSubject.asObservable();
  }

  reset(): void {
    this.resumeSubject.next(undefined);
    this.winSubject.next(undefined);
    this.propositionsSubject.next([]);
  }

  load(roundId: string, win: boolean, propositions: string[]): Observable<RoundEndSummaryDto | undefined> {
    this.winSubject.next(win);
    this.propositionsSubject.next(propositions);
    return this.motusRoundRepositoryService.getPoints(roundId)
      .pipe(
        catchError(() => of(undefined)),
        tap((value: RoundEndSummaryDto | undefined) => this.resumeSubject.next(value))
      )
  }
}
