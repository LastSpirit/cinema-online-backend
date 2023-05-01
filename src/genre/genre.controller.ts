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

import { GenreService } from './genre.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { CreateGenreDto } from './dto/create-genre.dto';

@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('collections')
	async getCollectionsGenre() {
		return this.genreService.getCollections();
	}

	@Get('/popular')
	async getPopular() {
		return this.genreService.getPopular();
	}

	@Get('by-slug/:slug')
	async getGenreBySlug(@Param('slug') slug: string) {
		return this.genreService.getBySlug(slug);
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.genreService.getAll(searchTerm);
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.genreService.create();
	}

	@Get(':id')
	async getGenreById(@Param('id') id: number) {
		return this.genreService.getGenreById(id);
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: number, @Body() dto: CreateGenreDto) {
		return this.genreService.update(id, dto);
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: number) {
		return this.genreService.delete(id);
	}
}
