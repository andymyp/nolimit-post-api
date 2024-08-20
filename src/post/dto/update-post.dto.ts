import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly content: string;
}
