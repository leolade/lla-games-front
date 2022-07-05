import { Component } from '@angular/core';
import { UntypedFormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { DarkModeService } from "./core/dark-mode.service";
import { AppLoader, LoaderService } from './core/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PartyGamesFront';

  loader$: Observable<AppLoader<any> | null>;
  isProd: boolean = environment.production;
  darkModeFC: UntypedFormControl = new UntypedFormControl(this.darkModeService.getDarkMode());

  constructor(private loaderService: LoaderService, private darkModeService: DarkModeService) {
    this.loader$ = this.loaderService.loader$;
    this.darkModeFC.valueChanges.subscribe(
      (value: boolean) => {
        this.darkModeService.updateDarkMode(value);
      }
    )
  }
}
