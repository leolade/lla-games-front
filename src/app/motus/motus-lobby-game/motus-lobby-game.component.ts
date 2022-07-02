import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MotusGameCreateParamsDto } from 'lla-party-games-dto/dist/motus-game-create-params.dto';
import { MotusGameDto } from 'lla-party-games-dto/dist/motus-game.dto';
import { BehaviorSubject } from 'rxjs';
import { MotusGameRepositoryService } from '../../repositories/motus-game-repository.service';

@Component({
  selector: 'app-motus-lobby-game',
  templateUrl: './motus-lobby-game.component.html',
  styleUrls: ['./motus-lobby-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotusLobbyGameComponent implements OnInit {

  creatingGamePendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(
    private router: Router,
    private gameRepository: MotusGameRepositoryService,
  ) {
  }

  ngOnInit(): void {
  }

  creerPartieClickHandler(): void {
    this.creatingGamePendingSubject.next(true);
    this.gameRepository.createGame({nbCharMin: 5, nbCharMax: 9, nbRound: 3} as MotusGameCreateParamsDto)
      .subscribe(
        (game: MotusGameDto) => {
          this.router.navigate(['game', game.gameId]);
        }
      )
  }
}
