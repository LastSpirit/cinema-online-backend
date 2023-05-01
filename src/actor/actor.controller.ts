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

import { ActorService } from './actor.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { ActorDto } from './dto/actor.dto';

@Controller('actors')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@Get('by-slug/:slug')
	async getGenreBySlug(@Param('slug') slug: string) {
		return this.actorService.getBySlug(slug);
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.actorService.getAll(searchTerm);
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.actorService.create();
	}

	@Get(':id')
	async getGenreById(@Param('id') id: number) {
		return this.actorService.findById(id);
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: number, @Body() dto: ActorDto) {
		return this.actorService.update(id, dto);
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: number) {
		return this.actorService.delete(id);
	}
}
