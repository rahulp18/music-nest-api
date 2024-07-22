import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaylistDTO } from './dto/create-playlist.dto';
import { SongService } from 'src/song/song.service';
import { UpdatePlaylistDTO } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(
    private prisma: PrismaService,
    private songService: SongService,
  ) {}

  async getAll() {
    return this.prisma.playlist.findMany({});
  }
  async getOne(id: string) {
    return this.prisma.playlist.findUnique({
      where: {
        id,
      },
    });
  }

  async create(playlist: CreatePlaylistDTO) {
    try {
      let createData: any = { ...playlist };
      if (playlist.songs) {
        const songs = await this.songService.findMany(playlist.songs);
        if (!songs) {
          throw new NotFoundException('Songs not found');
        }
        createData.songs = {
          connect: songs.map((song) => ({
            id: song.id,
          })),
        };
      }
      const newPlaylist = await this.prisma.playlist.create({
        data: {
          ...createData,
        },
      });
      return newPlaylist;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(id: string, playlist: UpdatePlaylistDTO) {
    try {
      let updateData: any = { ...playlist };
      if (playlist.songs) {
        const songs = await this.songService.findMany(playlist.songs);
        if (!songs) {
          throw new NotFoundException('Songs not found');
        }
        updateData.songs = {
          connect: songs.map((song) => ({
            id: song.id,
          })),
        };
      }
      const updatePlaylist = await this.prisma.playlist.update({
        where: {
          id,
        },
        data: {
          ...updateData,
        },
      });
      return updatePlaylist;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async delete(id: string) {
    try {
      const playlist = await this.prisma.playlist.findUnique({
        where: {
          id,
        },
      });
      if (!playlist) {
        throw new NotFoundException('Not Found playlist');
      }
      return this.prisma.playlist.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
