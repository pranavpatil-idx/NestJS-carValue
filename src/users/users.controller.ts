import { Controller, Post, Body, Patch, Param, Get, Query, Delete, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService){}

    @Get()
    listUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Get('/:id')
    async getUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Post('/signup')
    createUser(@Body() body : CreateUserDto){
        this.usersService.create(body.email, body.password)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: Partial<UpdateUserDto>) {
        return this.usersService.update(parseInt(id), body);
    }

}