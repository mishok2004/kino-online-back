import { GenreService } from './genre.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GenreModel } from './genre.model';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { UpdateUserDto } from 'src/user/dto/updateuser.dto';

@Controller('genres')
export class GenreController {

    constructor(private readonly genreModel: GenreModel) { }

    @Get('profile')
    @Auth()
    async getProfile(@User('_id') _id: string) {
        return this.genreService.byID(_id)
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
