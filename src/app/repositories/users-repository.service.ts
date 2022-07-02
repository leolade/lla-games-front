import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectedUserDto } from 'lla-party-games-dto/dist/connected-user.dto';
import { UpdateUserNameDto } from 'lla-party-games-dto/dist/update-user-name.dto';
import { UserDto } from 'lla-party-games-dto/dist/user.dto';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UsersRepository extends HttpService {

  constructor(
    protected override httpClient: HttpClient
  ) {
    super(httpClient, 'users')
  }

  whoAmI(): Observable<UserDto> {
    return this.get<UserDto>('who-am-i')
  }

  createUser(): Observable<string> {
    return this.postText(`user`, {});
  }

  updateUsername(username: UpdateUserNameDto): Observable<UserDto> {
    return this.put(`user/username`, username);
  }

  getUser(userId: string): Observable<ConnectedUserDto> {
    return (this.get(`user/${userId}`) as Observable<ConnectedUserDto>)
  }
}
