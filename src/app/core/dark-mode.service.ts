import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  private darkModeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getDarkModeFromLocalStorage());
  darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();
  private DARK_MODE_LLA_GAME: string = 'DARK_MODE_LLA_GAME';

  constructor() {
  }

  updateDarkMode(value: boolean) {
    this.darkModeSubject.next(value);
    localStorage.setItem(this.DARK_MODE_LLA_GAME, String(value))
  }

  getDarkMode(): boolean {
    return this.darkModeSubject.getValue();
  }

  private getDarkModeFromLocalStorage(): boolean {
    return JSON.parse(localStorage.getItem(this.DARK_MODE_LLA_GAME) || String(window.matchMedia('(prefers-color-scheme: dark)').matches)) === true;
  }
}
