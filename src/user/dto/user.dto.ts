import { User } from '../entities/user.entity';

export class UserDto {
  id: string;
  readonly name: string;
  readonly email: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
