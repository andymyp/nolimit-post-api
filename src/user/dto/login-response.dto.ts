import { UserDto } from './user.dto';
import { User } from '../entities/user.entity';

export class LoginResponseDto extends UserDto {
  token: string;

  constructor(user: User, token?: string) {
    super(user);
    this.token = token;
  }
}
