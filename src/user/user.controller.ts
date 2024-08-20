import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'User Profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  getUserById(@Req() request) {
    return this.userService.getUserById(request.user.id);
  }
}
