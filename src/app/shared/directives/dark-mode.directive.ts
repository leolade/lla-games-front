import {Directive, ElementRef, Renderer2} from '@angular/core';
import {DarkModeService} from "../../core/dark-mode.service";
import {merge, of} from "rxjs";

@Directive({
  selector: '[appDarkMode]'
})
export class DarkModeDirective {

  constructor(private renderer: Renderer2, private darkModeService: DarkModeService, hostElement: ElementRef) {
    merge(of(this.darkModeService.getDarkMode()), this.darkModeService.darkMode$).subscribe(
      (value: boolean) => {
        if (value) {
          renderer.addClass(hostElement.nativeElement, 'dark-theme');
        } else {
          renderer.removeClass(hostElement.nativeElement, 'dark-theme');
        }
      }
    )
  }

}