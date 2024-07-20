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
import { AlbumService } from './album.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}
  @Get()
  getAll() {
    return this.albumService.getAll();
  }
  @Get(':id')
  getById(@Param() param: { id: string }) {
    return this.albumService.getById(param.id);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() albumDto: CreateAlbumDTO) {
    return this.albumService.create(albumDto);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param() param, @Body() albumDto: UpdateAlbumDTO) {
    return this.albumService.update(param.id, albumDto);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param() param) {
    return this.albumService.delete(param.id);
  }
}
