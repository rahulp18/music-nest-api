import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SongOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { params } = request;
    const resourceId = params.id;

    const resource = await this.prisma.song.findUnique({
      where: { id: resourceId },
      include: {
        artists: true,
      },
    });

    if (!resource) {
      throw new ForbiddenException('Resource not found');
    }

    const isOwner = resource.artists.some(
      (artist) => artist.id === user.artistId,
    );

    if (!isOwner && user.role === 'USER') {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
