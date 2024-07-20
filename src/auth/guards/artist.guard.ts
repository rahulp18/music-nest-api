import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { params } = request;
    const resourceId = params.id;
    const resource = await this.prisma.artist.findUnique({
      where: { id: resourceId },
    });
    if (!resource) {
      throw new ForbiddenException('Resource not found');
    }
    if (resource.userId !== user.userId && user.role === 'USER') {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }
}
