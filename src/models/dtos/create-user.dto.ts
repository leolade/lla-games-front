import { UserDto } from './user.dto';

export interface CreateUserDto extends UserDto {
  password: string;
}
