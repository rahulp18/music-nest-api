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
import { SongService } from './song.service';
import { CreateSongDTO } from './dto/create-song.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateSongDTO } from './dto/update-song.dto';
import { SongOwnerGuard } from 'src/auth/guards/song.guard';

@Controller('song')
export class SongController {
  constructor(private songService: SongService) {}
  @Get()
  getAllSongs() {
    return this.songService.getAllSongs();
  }
  @Get(':id')
  getSong(@Param() param: { id: string }) {
    return this.songService.getSong(param.id);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() songDto: CreateSongDTO) {
    return this.songService.create(songDto);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, SongOwnerGuard)
  update(@Param() param, @Body() songDto: UpdateSongDTO) {
    return this.songService.update(param.id, songDto);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, SongOwnerGuard)
  delete(@Param() param) {
    return this.songService.delete(param.id);
  }
}
