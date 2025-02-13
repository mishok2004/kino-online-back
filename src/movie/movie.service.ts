import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { UpdateMovieDto } from './update-movie.dto';
import { Types } from 'mongoose';

@Injectable()
export class MovieService {

    constructor(@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>) { }

    async getAll(searchTerm?: string) {
        let options = {}

        if (searchTerm) options = {
            $or: [
                {
                    title: new RegExp(searchTerm, 'i')
                },
            ]
        }
        return this.MovieModel.find(options)
            .select('-updateAt -__v')
            .sort({
                createdAt: 'desc'
            }).populate('actor genres').exec()
    }

    async bySlug(slug: string) {
        const doc = await this.MovieModel.findOne({ slug }).populate('actor genres').exec()
        if (!doc) throw new NotFoundException('Movies not found')
        return doc
    }

    async byActor(actorId: string) {
        const doc = await this.MovieModel.find({ actor: actorId }).exec()
        if (!doc) throw new NotFoundException('Movies not found')
        return doc
    }

    async byGeneres(genereIds: Types.ObjectId[]) {
        const doc = await this.MovieModel.find({ generes: { $in: genereIds } }).exec()
        if (!doc) throw new NotFoundException('Movies not found')
        return doc
    }

    async updateCounterOpened(slug: string) {
        const updateDoc = await this.MovieModel.findOneAndUpdate({ slug }, {
            $inc: { countOpened: 1 },
        }).exec()

        if (!updateDoc) throw new NotFoundException('Movie not found')

        return updateDoc
    }

    async getMostPopular() {
        return this.MovieModel.find({ countOpened: { $gt: 0 } }).sort({ countOpened: -1 }).populate('genres').exec()
    }

    //admin
    async byId(_id: string) {
        const doc = await this.MovieModel.findById(_id)
        if (!doc) throw new NotFoundException('Movie not found')
        return doc
    }

    async create() {
        const defaultValue: UpdateMovieDto = {
            poster: '',
            bigPoster: '',
            title: '',
            description: '',
            slug: '',
            videoUrl: '',
            genres: [],
            actors: [],
        }
        const doc = await this.MovieModel.create(defaultValue)
        return doc._id
    }

    async update(_id: string, dto: UpdateMovieDto) {
        const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
            new: true,
        }).exec()

        if (!updateDoc) throw new NotFoundException('Movie not found')

        return updateDoc
    }

    async delete(id: string) {
        const delDoc = await this.MovieModel.findByIdAndDelete(id).exec()

        if (!delDoc) throw new NotFoundException('Movie not found')

        return delDoc
    }



}
