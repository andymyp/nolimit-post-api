import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './auth/jwt-payload.model';
import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class UserService {
  private readonly jwtPrivateKey: string;

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: typeof User,
  ) {
    this.jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
  }

  async signToken(user: User) {
    const payload: JwtPayload = {
      email: user.email,
    };

    return sign(payload, this.jwtPrivateKey, {});
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      user.name = createUserDto.name;
      user.email = createUserDto.email.trim().toLowerCase();

      const salt = await genSalt(10);
      user.password = await hash(createUserDto.password, salt);

      const userData = await user.save();

      const token = await this.signToken(userData);

      return new LoginResponseDto(userData, token);
    } catch (err) {
      if (err.original.constraint === 'user_email_key') {
        throw new HttpException(
          `User with email '${err.errors[0].value}' already exists`,
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    const users = await this.userRepository.findAll<User>();
    return users.map((user) => new UserDto(user));
  }

  async findOne(id: string) {
    const user = await this.userRepository.findByPk<User>(id);

    if (!user) {
      throw new HttpException(
        'User with given id not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return new UserDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findByPk<User>(id);
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.email || user.email;
    user.password = updateUserDto.password || user.password;

    try {
      const data = await user.save();
      return new UserDto(data);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.findByPk<User>(id);
    await user.destroy();
    return new UserDto(user);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne<User>({
      where: { email },
    });
  }

  async login(LoginRequestDto: LoginRequestDto) {
    const email = LoginRequestDto.email;
    const password = LoginRequestDto.password;

    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.signToken(user);
    return new LoginResponseDto(user, token);
  }
}
