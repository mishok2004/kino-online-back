import { TelegramService } from './../telegram/telegram.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { UpdateMovieDto } from './update-movie.dto';
import { Types } from 'mongoose';

@Injectable()
export class MovieService {
    constructor(
        @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
        private readonly telegramService: TelegramService) { }

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
            }).populate('actors genres').exec()
    }

    async bySlug(slug: string) {
        const doc = await this.MovieModel.findOne({ slug }).populate('actors genres').exec()
        if (!doc) throw new NotFoundException('Movies not found')
        return doc
    }

    async byActor(actorId: Types.ObjectId) {
        const doc = await this.MovieModel.find({ actors: actorId }).exec()
        if (!doc) throw new NotFoundException('Movies not found')
        return doc
    }

    async byGenres(genreIds: Types.ObjectId[]) {
        const doc = await this.MovieModel.find({ genres: { $in: genreIds } }).exec()
        if (!doc) throw new NotFoundException('Movies not found')
        return doc
    }

    async getMostPopular() {
        return this.MovieModel.find({ countOpened: { $gt: 0 } }).sort({ countOpened: -1 }).populate('genres').exec()
    }

    async updateCountOpened(slug: string) {
        const updateDoc = await this.MovieModel.findOneAndUpdate({ slug }, {
            $inc: { countOpened: 1 },
        },
            {
                new: true
            }).exec()

        if (!updateDoc) throw new NotFoundException('Movie not found')

        return updateDoc
    }

    async updateRating(id: Types.ObjectId, newRating: number) {
        return this.MovieModel.findByIdAndUpdate(id, { rating: newRating }, { new: true }).exec()
    }

    //admin
    async byId(_id: string) {
        const doc = await this.MovieModel.findById(_id)
        if (!doc) throw new NotFoundException('Movie not found')
        return doc
    }

    async create() {
        const defaultValue: UpdateMovieDto = {
            bigPoster: '',
            actors: [],
            genres: [],
            poster: '',
            title: '',
            videoUrl: '',
            slug: '',
        }
        const movie = await this.MovieModel.create(defaultValue)
        return movie._id
    }

    async update(_id: string, dto: UpdateMovieDto) {
        // if (!dto.isSendTelegram) {
        //     await this.sendNotification(dto)
        //     dto.isSendTelegram = true
        // }

        await this.sendNotification(dto)


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

    async sendNotification(dto: UpdateMovieDto) {
        // if (process.env.NODE_ENV !== 'development')
        //     await this.telegramService.sendPhoto(dto.poster)
        await this.telegramService.sendPhoto('https://i.pinimg.com/originals/bc/27/fe/bc27fe46a0ff19e59b0e387c290c80a7.jpg')

        const msg = `<b> ${dto.title} </b>`
        await this.telegramService.sendMessage(msg, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            url: 'https://hd.kinopoisk.ru/?playingContentId=677a93072d7c48928241a4486694e872&rt=677a93072d7c48928241a4486694e872&watch=',
                            text: 'Go to watch'
                        }
                    ]
                ]
            }
        })

    }

}
