import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GenreEntity } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenreService {
	constructor(
		@InjectRepository(GenreEntity)
		private repository: Repository<GenreEntity>,
	) {}

	async getGenreById(id: number) {
		const genre = await this.repository.findOneBy({ id: id });

		if (!genre) throw new NotFoundException('Genre not found');

		return genre;
	}

	async getBySlug(slug: string) {
		const genre = await this.repository.findOne({
			where: {
				slug: slug,
			},
		});

		if (!genre) throw new NotFoundException('Genre not found');

		return genre;
	}

	async getCollections() {
		return this.repository.find();
	}

	async getPopular() {
		const genres = await this.repository
			.createQueryBuilder('genre')
			.orderBy('genre.updateddAt', 'DESC')
			.getMany();
		return genres;
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			slug: '',
			name: '',
			description: '',
			icon: '',
		};

		const genre = await this.repository.save(defaultValue);
		return genre.id;
	}

	getAll(searchTerm?: string) {
		if (searchTerm) {
			const genres = this.repository
				.createQueryBuilder()
				.select()
				.orWhere('name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
				.orWhere('slug ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
				.orWhere('description ILIKE :searchTerm', {
					searchTerm: `%${searchTerm}%`,
				})
				.getMany();

			return genres;
		}

		return this.repository.find({
			order: {
				createdAt: 'DESC',
			},
		});
	}

	async update(id: number, dto: CreateGenreDto) {
		const genre = await this.repository.findOneBy({ id: id });

		if (!genre) throw new NotFoundException('Genre not found');

		return this.repository.update(id, dto);
	}

	async delete(id: number) {
		const genre = await this.repository.findOneBy({ id: id });

		if (!genre) throw new NotFoundException('Genre not found');

		return this.repository.delete(id);
	}
}
