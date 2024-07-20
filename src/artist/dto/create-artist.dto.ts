import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArtistDTO {
  @IsString()
  @IsOptional()
  bio: string;
  @IsString()
  @IsOptional()
  imageUrl: string;
}
