import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsObject,
	IsString,
} from 'class-validator';
import { ActorEntity } from 'src/actor/entities/actor.entity';
import { GenreEntity } from 'src/genre/entities/genre.entity';

class Parameters {
	@IsNumber()
	year?: number;

	@IsNumber()
	duration?: number;

	@IsString()
	country?: string;
}

export class CreateMovieDto {
	@IsString()
	poster: string;

	@IsString()
	bigPoster: string;

	@IsString()
	title: string;

	@IsString()
	slug: string;

	@IsString()
	videoUrl: string;

	isSendTelegram?: boolean;

	@IsObject()
	parameters?: Parameters;

	@IsArray()
	genres: { id: number }[];

	@IsArray()
	actors: { id: number }[];
}
