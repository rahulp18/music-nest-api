import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AlbumService } from 'src/album/album.service';

@Module({
  imports: [PrismaModule],
  controllers: [ArtistController],
  providers: [ArtistService, AlbumService],
})
export class ArtistModule {}
