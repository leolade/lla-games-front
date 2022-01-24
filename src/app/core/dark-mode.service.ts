import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  private darkModeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getDarkModeFromLocalStorage());
  darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();
  static DARK_MODE_LLA_GAME: string = 'LLA_GAME:DARK_MODE';

  constructor() {
  }

  updateDarkMode(value: boolean) {
    this.darkModeSubject.next(value);
    localStorage.setItem(DarkModeService.DARK_MODE_LLA_GAME, String(value))
  }

  getDarkMode(): boolean {
    return this.darkModeSubject.getValue();
  }

  private getDarkModeFromLocalStorage(): boolean {
    const localStorageItem: string | null = localStorage.getItem(DarkModeService.DARK_MODE_LLA_GAME);
    if (localStorageItem === null) {
      return JSON.parse(String(window.matchMedia('(prefers-color-scheme: dark)').matches));
    }
    return !!JSON.parse(localStorageItem as string);
  }
}
