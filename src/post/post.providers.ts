import { Post } from './entities/post.entity';

export const postProviders = [{ provide: 'PostRepository', useValue: Post }];
