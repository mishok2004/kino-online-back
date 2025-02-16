import { IsString, IsNumber, IsArray, IsBoolean, IsObject } from "class-validator"

export class Parametrs {
    @IsNumber()
    year: number

    @IsNumber()
    duration: number

    @IsString()
    coantry: string
}

export class UpdateMovieDto {
    @IsString()
    poster: string

    @IsString()
    bigPoster: string

    @IsString()
    title: string

    @IsString()
    slug: string

    @IsObject()
    parametrs?: Parametrs

    @IsString()
    videoUrl: string

    @IsArray()
    @IsString({ each: true })
    genres: string[]

    @IsArray()
    @IsString({ each: true })
    actors: string[]

    isSendTelegram?: boolean

}