import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';

import { Auth } from 'src/auth/decorators/auth.decorators';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Get('by-slug/:slug')
	async getGenreBySlug(@Param('slug') slug: string) {
		return this.movieService.getBySlug(slug);
	}

	@Post('by-genres')
	@HttpCode(200)
	async byGenres(
		@Body('genreIds')
		genreIds: number[],
	) {
		return this.movieService.byGenres(genreIds);
	}

	@Get('by-actor/:actorId')
	async byActor(@Param('actorId', ValidationPipe) actorId: number) {
		return this.movieService.byActor(actorId);
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.movieService.getAll(searchTerm);
	}

	@Get('/most-popular')
	async getMostPopular() {
		return this.movieService.getMostPopular();
	}

	@Post('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.movieService.updateCountOpened(slug);
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.movieService.create();
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: number, @Body() dto: CreateMovieDto) {
		return this.movieService.update(id, dto);
	}

	@Get(':id')
	async getGenreById(@Param('id') id: number) {
		return this.movieService.findById(id);
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: number) {
		return this.movieService.delete(id);
	}
}
