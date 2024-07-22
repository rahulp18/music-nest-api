import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song.dto';
import { ArtistService } from 'src/artist/artist.service';
import { UpdateSongDTO } from './dto/update-song.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SongService {
  constructor(
    private prisma: PrismaService,
    private artistService: ArtistService,
  ) {}

  async create(songDto: CreateSongDTO) {
    const artists = await this.artistService.findMany(songDto.artists);
    if (!artists) {
      throw new NotFoundException('Artists not found');
    }
    const song = await this.prisma.song.create({
      data: {
        ...songDto,
        artists: {
          connect: artists.map((artist) => ({ id: artist.id })),
        },
      },
      include: {
        artists: true,
      },
    });
    return song;
  }
  async getAllSongs() {
    return await this.prisma.song.findMany({
      include: {
        artists: true,
      },
    });
  }
  async getSong(id: string) {
    return await this.prisma.song.findUnique({
      where: {
        id,
      },
      include: {
        artists: true,
      },
    });
  }
  async delete(id: string) {
    return await this.prisma.song.delete({
      where: {
        id,
      },
    });
  }
  async update(id: string, songDto: UpdateSongDTO) {
    const song = await this.prisma.song.findUnique({
      where: {
        id,
      },
      include: {
        artists: true,
      },
    });
    if (!song) {
      throw new NotFoundException('Invalid song Id');
    }
    let updateData: any = { ...songDto };
    if (songDto && songDto.artists && songDto.artists.length > 0) {
      const artists = await this.artistService.findMany(songDto.artists);
      if (!artists) {
        throw new NotFoundException('Artists not found');
      }
      updateData.artists = {
        set: artists.map((artist) => ({ id: artist.id })),
      };
    }
    return this.prisma.song.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        artists: true,
      },
    });
  }
  async findMany(ids: string[]) {
    return this.prisma.song.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
