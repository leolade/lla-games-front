import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidateMotDto } from 'lla-party-games-dto/dist/validate-mot.dto';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MotRepositoryService extends HttpService {

  constructor(
    private authService: AuthService,
    protected override httpClient: HttpClient
  ) {
    super(httpClient, 'mot')
  }

  getRandomWordsWithSpecificLength(nbLettreMin: number, nbLettreMax: number, nbRandom: number): Observable<string[]> {
    return this.get(`random/${nbLettreMin}/${nbLettreMax}/${nbRandom}`);
  }

  getRandomWordWithSpecificLength(nbLettreMin: number, nbLettreMax: number): Observable<string> {
    return this.getText(`random/${nbLettreMin}/${nbLettreMax}`);
  }

  getRandomWords(nbRandom: number): Observable<string[]> {
    return this.get(`random/${nbRandom}`);
  }

  getRandomWord(): Observable<string> {
    return this.getText(`random`);
  }

  valiadteWord(validateMotDTO: ValidateMotDto): Observable<string> {
    return this.postText('validate', validateMotDTO);
  }

  exist(mot: string): Observable<boolean> {
    return this.get(`exist/${mot}`);
  }
}
