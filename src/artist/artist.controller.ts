import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateArtistDTO } from './dto/create-artist.dto';
import { UpdateArtistDTO } from './dto/update-artist.dto';
import { ArtistGuard } from 'src/auth/guards/artist.guard';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}
  @Get()
  findAll() {
    return this.artistService.findAll();
  }
  @Get(':id')
  findById(@Param() { id }: { id: string }) {
    return this.artistService.findById(id);
  }
  @Get(':id/albums')
  findAlbums(@Param() { id }: { id: string }) {
    return this.artistService.getAlbums(id);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  createArtist(@Req() req, @Body() artist: CreateArtistDTO) {
    return this.artistService.create(req.user.userId, artist);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, ArtistGuard)
  updateArtist(@Param() param, @Body() artist: UpdateArtistDTO) {
    return this.artistService.update(param.id, artist);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, ArtistGuard)
  delete(@Param() param) {
    return this.artistService.delete(param.id);
  }
}
