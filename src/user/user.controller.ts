import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateuser.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('profile')
    @Auth()
    async getProfile(@User('_id') _id: string) {
        return this.userService.byID(_id)
    }

    @UsePipes(new ValidationPipe())
    @Put('profile')
    @HttpCode(200)
    @Auth()
    async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateProfile(__dirname, dto)
    }


    @Get()
    @Auth('admin')
    async getUsers(@Query('searchTerm') searchTerm?: string) {
        return this.userService.getAll(searchTerm)
    }

    @Get(':id')
    @Auth('admin')
    async getUser(@Param('_id', IdValidationPipe) id: string) {
        return this.userService.byID(id)
    }


    @Get('count')
    @Auth('admin')
    async getCountUsers() {
        return this.userService.getCount()
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async updateUser(@Param('id', IdValidationPipe) id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateProfile(id, dto)
    }



    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async deleteUser(@Param('id', IdValidationPipe) id: string) {
        return this.userService.delete(id)
    }

}
