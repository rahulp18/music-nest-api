import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePlaylistDTO } from './dto/create-playlist.dto';
import { UpdatePlaylistDTO } from './dto/update-playlist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}
  @Get()
  getAll() {
    return this.playlistService.getAll();
  }
  @Get(':id')
  getPlaylist(@Param() param: { id: string }) {
    return this.playlistService.getOne(param.id);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() playlistDto: CreatePlaylistDTO) {
    return this.playlistService.create(playlistDto);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param() param, @Body() playlistDto: UpdatePlaylistDTO) {
    return this.playlistService.update(param.id, playlistDto);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param() param) {
    return this.playlistService.delete(param.id);
  }
}
