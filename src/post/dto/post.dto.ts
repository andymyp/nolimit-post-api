import { Post } from '../entities/post.entity';

export class PostDto {
  readonly id: number;
  readonly authorId: string;
  readonly authorName: string;
  readonly title: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(post: Post) {
    this.id = post.id;
    this.authorId = post.authorId;
    this.authorName = post.user.name;
    this.title = post.title;
    this.content = post.content;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
