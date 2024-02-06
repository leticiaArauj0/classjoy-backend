/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    async create({first_name, last_name, email, password, role}: CreateUserDTO) {

        await this.emailExists(email)

        password = await bcrypt.hash(password, await bcrypt.genSalt())

        return this.prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                password,
                role
           },
        })
    }

    async list() {
        return this.prisma.user.findMany()
    }

    async show(id: number) {

        await this.exists(id)

        return this.prisma.user.findUnique({
            where: {
                id
            }
        })
    }

    async update(id: number, {first_name, last_name, email, password}: UpdatePutUserDTO) {

        await this.exists(id)

        password = await bcrypt.hash(password, await bcrypt.genSalt())

        return this.prisma.user.update({
            data: {
                first_name,
                last_name,
                email,
                password,
            },

            where: {
                id
            }
        })
    }

    async updatePartial(id: number, {first_name, last_name, email, password}: UpdatePatchUserDTO) {

        await this.exists(id)

        password = await bcrypt.hash(password, await bcrypt.genSalt())

        const data: any = {}

        if(first_name) {
            data.first_name = first_name
        }

        if(last_name) {
            data.last_name = last_name
        }

        if(email) {
            data.email = email
        }

        if(password) {
            data.password = password
        }

        return this.prisma.user.update({
            data,

            where: {
                id
            }
        })
    }

    async delete(id: number) {

        await this.exists(id)

        return this.prisma.user.delete({
            where: {
                id
            }
        })
    }

    async exists(id: number) {
        if(!(await this.prisma.user.count({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`O usuário ${id} não existe`)
        }
    }

    async findUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new NotFoundException(`Email: ${email} Not Found`);
        }
            
        return user;
    }

    async emailExists(email: string) {

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if(user){
            throw new NotFoundException(`O Email ${email} já está sendo usado`)
        }
    }
}
