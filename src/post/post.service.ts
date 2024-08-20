import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject('PostRepository')
    private readonly postRepository: typeof Post,
  ) {}

  async create(authorId: string, createPostDto: CreatePostDto) {
    const post = new Post();

    post.authorId = authorId;
    post.title = createPostDto.title;
    post.content = createPostDto.content;

    const postData = await post.save();

    return {
      statusCode: HttpStatus.OK,
      data: postData,
    };
  }

  async findAll() {
    const posts = await this.postRepository.findAll<Post>({
      include: [User],
    });

    return {
      statusCode: HttpStatus.OK,
      data: posts.map((post) => new PostDto(post)),
    };
  }

  async findOne(id: number) {
    const post = await this.postRepository.findByPk<Post>(id, {
      include: [User],
    });

    if (!post) {
      throw new HttpException('No post found', HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      data: new PostDto(post),
    };
  }

  async update(id: number, authorId: string, updatePostDto: UpdatePostDto) {
    const post = await this.getUserPost(id, authorId);

    post.title = updatePostDto.title || post.title;
    post.content = updatePostDto.content || post.content;

    const postData = await post.save();

    return {
      statusCode: HttpStatus.OK,
      data: postData,
    };
  }

  async remove(id: number, authorId: string) {
    const post = await this.getUserPost(id, authorId);

    await post.destroy();

    return {
      statusCode: HttpStatus.OK,
      data: post,
    };
  }

  async getUserPost(id: number, authorId: string) {
    const post = await this.postRepository.findByPk<Post>(id);
    if (!post) {
      throw new HttpException('No post found', HttpStatus.NOT_FOUND);
    }

    if (post.authorId !== authorId) {
      throw new HttpException(
        'You are unauthorized to manage this post',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return post;
  }
}
