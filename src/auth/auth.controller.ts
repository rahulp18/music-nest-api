import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ValidateTokenDTO } from './dto/verify-2fa.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() signupDto: SignUpDto) {
    return this.authService.register(signupDto);
  }
  @Post('login')
  login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }
  @Post('enable2FA')
  @UseGuards(JwtAuthGuard)
  enable2FA(@Req() req) {
    return this.authService.enable2FA(req.user.userId);
  }
  @Post('disable2FA')
  @UseGuards(JwtAuthGuard)
  disable2FA(@Req() req) {
    return this.authService.disable2FA(req.user.userId);
  }
  @Post('verify2FA')
  @UseGuards(JwtAuthGuard)
  validate2FA(@Req() req, @Body() { token }: ValidateTokenDTO) {
    return this.authService.validate2FA(req.user.userId, token);
  }
}
