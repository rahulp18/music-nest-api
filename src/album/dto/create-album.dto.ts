import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  releaseDate: string;
  @IsString()
  @IsOptional()
  coverUrl?: string;
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  songs?: string[];
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  artists?: string[];
}
