import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash, compare } from 'bcrypt';
import { RegisterRequestDto } from './dto/register-request.dto';
import { User } from 'src/user/entities/user.entity';
import { JwtPayload } from './jwt/jwt-payload.model';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signToken(user: User) {
    const payload: JwtPayload = {
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  async register(registerRequestDto: RegisterRequestDto) {
    try {
      const user = new User();
      user.name = registerRequestDto.name;
      user.email = registerRequestDto.email.trim().toLowerCase();

      const salt = await genSalt(10);
      user.password = await hash(registerRequestDto.password, salt);

      const userData = await user.save();

      return {
        statusCode: HttpStatus.OK,
        data: new LoginResponseDto(userData),
      };
    } catch (err) {
      if (err.original.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          `User with email '${err.errors[0].value}' already exists`,
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginRequestDto: LoginRequestDto) {
    const email = loginRequestDto.email;
    const password = loginRequestDto.password;

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Invalid email or password.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.signToken(user);

    return {
      statusCode: HttpStatus.OK,
      data: new LoginResponseDto(user, token),
    };
  }
}
