import { User } from './entities/user.entity';

export const userProviders = [
  {
    provide: 'UserRepository',
    useValue: User,
  },
];
