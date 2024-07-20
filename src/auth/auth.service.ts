import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { LogInDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import { ExtendedUser } from 'src/types';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}
  async register(signupDto: SignUpDto) {
    try {
      const user = await this.userService.findByEmail(signupDto.email);
      if (user) {
        return new HttpException('User already exist', HttpStatus.CONFLICT);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(signupDto.password, salt);
      const newUser = await this.userService.create({
        ...signupDto,
        password: hashedPassword,
      });
      return newUser;
    } catch (error: any) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async login(loginDto: LogInDto): Promise<{ access_token: string } | any> {
    try {
      const user: ExtendedUser = await this.userService.findByEmail(
        loginDto.email,
      );
      if (!user) {
        return new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      }
      const isPasswordMatch = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordMatch) {
        return new HttpException(
          'PASSWORD DOES NOT MATCHED',
          HttpStatus.FORBIDDEN,
        );
      }
      const payload: any = { sub: user.id, role: user.role, email: user.email };
      if (user.artist) {
        payload.artistId = user.artist.id;
      }
      const token = this.jwt.sign(payload);
      return { access_token: token };
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async enable2FA(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.enable2FA) {
      return { secret: user.secret2FA };
    }
    const secret = speakeasy.generateSecret();
    await this.userService.updateUserSecret(userId, secret.base32);
    return { secret: secret.base32 };
  }
  async disable2FA(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updatedUser = await this.userService.disable2FA(userId);
    return { message: '2FA Disabled', data: updatedUser };
  }
  async validate2FA(userId: string, token: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const verified = speakeasy.totp.verify({
      secret: user.secret2FA,
      token,
      encoding: 'base32',
    });
    if (verified) {
      return { verified: true };
    } else {
      return { verified: false };
    }
  }
}
