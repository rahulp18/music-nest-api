import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaylistDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsArray()
  @IsString({ each: true })
  songs: string[];
}
