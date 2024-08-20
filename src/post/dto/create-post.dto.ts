import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
