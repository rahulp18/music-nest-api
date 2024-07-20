import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtistDTO } from './dto/create-artist.dto';
import { UpdateArtistDTO } from './dto/update-artist.dto';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    private prisma: PrismaService,
    private albumsService: AlbumService,
  ) {}
  async findAll() {
    return await this.prisma.artist.findMany({});
  }
  async findById(id: string) {
    return await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
  }
  async findByUserId(userId: string) {
    return await this.prisma.artist.findUnique({
      where: {
        userId,
      },
    });
  }

  async create(userId: string, artistDto: CreateArtistDTO) {
    return await this.prisma.artist.create({
      data: {
        ...artistDto,
        userId,
      },
    });
  }
  async update(id: string, artistDto: UpdateArtistDTO) {
    return await this.prisma.artist.update({
      where: {
        id,
      },
      data: {
        ...artistDto,
      },
    });
  }
  async delete(id: string) {
    return await this.prisma.artist.delete({
      where: {
        id,
      },
    });
  }
  async findMany(artistIds: string[]) {
    return this.prisma.artist.findMany({
      where: {
        id: {
          in: artistIds,
        },
      },
    });
  }
  async getAlbums(artistId: string) {
    this.albumsService.getByArtistId(artistId);
  }
}
