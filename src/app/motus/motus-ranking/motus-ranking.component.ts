import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MotusRoundRankDto } from 'lla-party-games-dto/dist/motus-round-rank.dto';

@Component({
  selector: 'app-motus-ranking',
  templateUrl: './motus-ranking.component.html',
  styleUrls: ['./motus-ranking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotusRankingComponent {
  @Input() ranks: MotusRoundRankDto[] | null = [];

  constructor() {
  }

}
