import { PartialType } from '@nestjs/mapped-types';
import { UserRole } from '@prisma/client';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  enable2FA?: boolean;

  @IsString()
  @IsOptional()
  secret2FA?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
