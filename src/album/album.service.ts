import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSongDTO } from 'src/song/dto/create-song.dto';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { UpdateAlbumDTO } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.album.findMany({
      include: {
        artists: true,
        songs: true,
      },
    });
  }
  async getById(id: string) {
    return this.prisma.album.findUnique({
      where: {
        id,
      },
      include: {
        artists: true,
        songs: true,
      },
    });
  }
  async create(albumDto: CreateAlbumDTO) {
    try {
      const { artists, songs, ...albumData } = albumDto;
      // Prepare the data object for album creation
      let albumCreateData: any = {
        ...albumData,
      };
      // Handle artists relationship
      if (artists && artists.length > 0) {
        albumCreateData.artists = {
          connect: artists.map((artistId) => ({ id: artistId })),
        };
      }

      // Handle songs relationship
      if (songs && songs.length > 0) {
        albumCreateData.songs = {
          connect: songs.map((songId) => ({ id: songId })),
        };
      }
      // Create the album
      const album = await this.prisma.album.create({
        data: albumCreateData,
        include: {
          artists: true,
          songs: true,
        },
      });
      return album;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(id: string, albumDto: UpdateAlbumDTO) {
    try {
      const album = await this.prisma.album.findUnique({
        where: {
          id,
        },
      });
      if (!album) {
        throw new HttpException('Not foundAlbum', HttpStatus.NOT_FOUND);
      }
      const { artists, songs, ...albumData } = albumDto;
      // Prepare the data object for album creation
      let albumCreateData: any = {
        ...albumData,
      };
      // Handle artists relationship
      if (artists && artists.length > 0) {
        albumCreateData.artists = {
          connect: artists.map((artistId) => ({ id: artistId })),
        };
      }

      // Handle songs relationship
      if (songs && songs.length > 0) {
        albumCreateData.songs = {
          connect: songs.map((songId) => ({ id: songId })),
        };
      }
      // Create the album
      const updatedAlbum = await this.prisma.album.create({
        data: albumCreateData,
        include: {
          artists: true,
          songs: true,
        },
      });
      return updatedAlbum;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async delete(id: string) {
    try {
      const album = await this.prisma.album.findUnique({
        where: {
          id,
        },
      });
      if (!album) {
        throw new HttpException('Not foundAlbum', HttpStatus.NOT_FOUND);
      }
      return this.prisma.album.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getByArtistId(id: string) {
    return this.prisma.album.findMany({
      where: {
        artists: {
          some: {
            id: {
              equals: id,
            },
          },
        },
      },
    });
  }
}
