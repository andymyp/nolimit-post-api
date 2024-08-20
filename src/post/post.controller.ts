import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Posts' })
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Post' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Post' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPostDto: CreatePostDto, @Req() request) {
    return this.postService.create(request.user.id, createPostDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Post' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() request,
  ) {
    return this.postService.update(+id, request.user.id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Post' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() request) {
    return this.postService.remove(+id, request.user.id);
  }
}
