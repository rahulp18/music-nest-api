import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';

@Module({
  imports: [PrismaModule],
  providers: [SongService, ArtistService, AlbumService],
  controllers: [SongController],
})
export class SongModule {}
