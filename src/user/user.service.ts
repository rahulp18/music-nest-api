import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { ExtendedUser } from 'src/types';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(userData: SignUpDto): Promise<User> {
    console.log(userData);
    return this.prisma.user.create({
      data: userData,
    });
  }
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        followers: true,
        artist: true,
        following: true,
        playlists: true,
      },
    });
  }
  async findByEmail(email: string): Promise<ExtendedUser> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        followers: true,
        artist: true,
        following: true,
        playlists: true,
      },
    });
  }
  async findById(id: string): Promise<ExtendedUser> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        followers: true,
        artist: true,
        following: true,
        playlists: true,
      },
    });
  }
  async updateUserSecret(userId: string, secret: string) {
    try {
      const user = await this.findById(userId);
      if (!user) {
        return new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          secret2FA: secret,
          enable2FA: true,
        },
      });
      return updatedUser;
    } catch (error) {
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async disable2FA(userId: string) {
    try {
      const user = await this.findById(userId);
      if (!user) {
        return new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          secret2FA: null,
          enable2FA: false,
        },
      });
      return updatedUser;
    } catch (error) {
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt(10);
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,
          salt,
        );
      }
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...updateUserDto,
        },
      });
      return updatedUser;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async deleteUser(userId: string) {
    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
