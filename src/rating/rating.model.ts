import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { MovieModel } from 'src/movie/movie.model'
import { UserModel } from 'src/user/user.model'

export interface Model extends Base { }

export class RatingModel extends TimeStamps {

    @prop({ ref: () => UserModel })
    userId: Ref<UserModel>

    @prop({ ref: () => MovieModel })
    movieId: Ref<MovieModel>

    @prop({ unique: true })
    value: number

}
