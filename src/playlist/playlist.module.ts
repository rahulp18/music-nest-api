import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SongService } from 'src/song/song.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlaylistController, SongService],
  providers: [PlaylistService],
})
export class PlaylistModule {}
