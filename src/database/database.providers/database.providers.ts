import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

export const DatabaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      });

      sequelize.addModels([User, Post]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
