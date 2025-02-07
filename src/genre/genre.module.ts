import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModule,
        schemaOptions: {
          collection: 'Genre',
        },
      },
    ]),
  ],


  controllers: [GenreController],
  providers: [GenreService]
})
export class GenreModule { }
