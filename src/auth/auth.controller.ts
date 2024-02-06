/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/files/file.service';
import { join } from 'path';
import { AuthValidateDTO } from './dto/auth-validate.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly fileService: FileService) {}

  @Post('login')
  async login(@Body() {email, password}: AuthLoginDTO) {
    return this.authService.login(email, password)
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO){
    return this.authService.register(body)
  }

  @UseGuards(AuthGuard)
  @Post('forget') 
  async forget(@Body() {email}: AuthForgetDTO){
    return this.authService.forget(email)
  }

  @UseGuards(AuthGuard)
  @Post('reset')
  async reset(@Body() {password}: AuthResetDTO) {
    return this.authService.reset(password)
  }

  @Post('validate')
  async checkToken(@Body() { token }: AuthValidateDTO) {
    return this.authService.checkToken(token)
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('photo')
  async uploadPhoto(@User() user, @UploadedFile(new ParseFilePipe({
    validators: [
      new FileTypeValidator({fileType: 'image/*'}),
      new MaxFileSizeValidator({maxSize: 2097152})
    ]
  })) photo: Express.Multer.File) {

    const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.jpeg`) 

    try {
      await this.fileService.upload(photo, path)
    } catch(e) {
      throw new BadRequestException(e)
    }
    
    return {success: true}
  }

  @UseGuards(AuthGuard)
  @Post('user')
  async user(@User() user) {
    return {user}
  }
}
