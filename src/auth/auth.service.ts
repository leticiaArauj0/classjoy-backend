/* eslint-disable prettier/prettier */
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthRegisterDTO } from './dto/auth-register';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private issuer = 'login'

  constructor(
    private readonly jwtService: JwtService, 
    private readonly prisma: PrismaService, 
    private readonly userService: UserService,
    private readonly mailer: MailerService
    ) {}

  createToken(user: User) {
    return this.jwtService.sign({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }, {
        subject: String(user.id),
        issuer: this.issuer,
        expiresIn: '7 days'
      })
  }

  async checkToken(token: string) {
    try {
      const data = await this.jwtService.verify(token, {
        issuer: this.issuer,
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: data.id,
        }
      })

      return {user: user};
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password:string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    })

    if(!user) {
      throw new UnauthorizedException('Email e/ou senha incorretos.');
    }

    if(!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Email e/ou senha incorretos.');
    }

    const jwt = this.createToken(user)

    return {token: jwt, user: user};
  }

  async forget(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if(!user) {
      throw new UnauthorizedException('Email incorreto');
    }

    this.mailer.sendMail({
      subject: "Recuperação de Senha",
      to: email,
      template: "forget",
      context: {
        name: "",
        link: ""
      }
    })

    return true;
  }

  async reset(password: string) {
    // Se validar o token

    const id = 0;

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    const jwt = this.createToken(user)

    return {token: jwt, user: user};
  }
}
