import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardEventService {

  constructor() { }

  onKeyDown($event: KeyboardEvent): void {
    console.debug(`Keydown : ` + $event)
  }

  isLetterKeyboardEvent($event: KeyboardEvent): boolean {
    return new RegExp(`^[a-zA-Z]$`).test($event.key);
  }

  isDeleteKeyboardEvent($event: KeyboardEvent): boolean {
    return $event.key === "Backspace" || $event.key === "Delete";
  }

  isEnterKeyboardEvent($event: KeyboardEvent): boolean {
    return $event.key === "Enter";
  }
}
