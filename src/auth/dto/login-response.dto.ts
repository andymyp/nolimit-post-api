import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';

export class LoginResponseDto extends UserDto {
  token: string;

  constructor(user: User, token?: string) {
    super(user);
    this.token = token;
  }
}
