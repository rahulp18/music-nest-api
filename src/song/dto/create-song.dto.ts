import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateSongDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  lyrics: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly artists: string[];
}
