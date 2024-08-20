import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly content: string;
}
