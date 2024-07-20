import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.userService.findById(req.user.userId);
  }
  @Get(':id')
  getUserById(@Param() { id }: { id: string }) {
    return this.userService.findById(id);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  updateUser(@Param() { id }: { id: string }, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  delete(@Param() { id }: { id: string }) {
    return this.userService.deleteUser(id);
  }
  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }
}
