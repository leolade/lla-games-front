import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppLoader, LoaderService } from '../core/loader.service';

@Component({
  selector: 'app-loader-overlay',
  templateUrl: './loader-overlay.component.html',
  styleUrls: ['./loader-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderOverlayComponent implements OnInit {

  loaderMessage$: Observable<string | undefined>;

  constructor(
    private loaderService: LoaderService
  ) {
    this.loaderMessage$ = this.loaderService.loader$.pipe(
      map((loader?: AppLoader<any> | null) => {
        return loader?.message || undefined
      })
    )
  }

  ngOnInit(): void {
  }

}
