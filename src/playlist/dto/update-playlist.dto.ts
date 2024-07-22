import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaylistDTO } from './create-playlist.dto';

export class UpdatePlaylistDTO extends PartialType(CreatePlaylistDTO) {}
