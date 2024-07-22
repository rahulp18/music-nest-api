import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArtistModule } from './artist/artist.module';
import { SongModule } from './song/song.module';
import { AlbumModule } from './album/album.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, ArtistModule, SongModule, AlbumModule, PlaylistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
