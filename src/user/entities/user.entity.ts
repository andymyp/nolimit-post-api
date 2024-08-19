import {
  Table,
  Column,
  Model,
  IsUUID,
  PrimaryKey,
  Unique,
  IsEmail,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @Unique
  @IsEmail
  @Column
  email: string;

  @Column(DataType.TEXT)
  password: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
