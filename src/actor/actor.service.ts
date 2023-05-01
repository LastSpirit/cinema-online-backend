import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActorEntity } from './entities/actor.entity';
import { ActorDto } from './dto/actor.dto';

@Injectable()
export class ActorService {
	constructor(
		@InjectRepository(ActorEntity)
		private repository: Repository<ActorEntity>,
	) {}

	async findById(id: number) {
		const actor = await this.repository.findOneBy({ id: id });

		if (!actor) throw new NotFoundException('Actor not found');

		return actor;
	}

	async getBySlug(slug: string) {
		const actor = await this.repository.findOne({
			where: {
				slug: slug,
			},
		});

		if (!actor) throw new NotFoundException('Actor not found');

		return actor;
	}

	async create() {
		const defaultValue: ActorDto = {
			slug: '',
			name: '',
			photo: '',
		};

		const actor = await this.repository.save(defaultValue);
		return actor.id;
	}

	getAll(searchTerm?: string) {
		if (searchTerm) {
			const actors = this.repository
				.createQueryBuilder()
				.select()
				.orWhere('name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
				.orWhere('slug ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
				.getMany();

			return actors;
		}

		return this.repository
			.createQueryBuilder('actor')
			.leftJoin('actor.movies', 'movie')
			.select('actor.*')
			.addSelect('COUNT(movie.id)', 'countMovies')
			.groupBy('actor.id')
			.getRawMany();
	}

	async update(id: number, dto: ActorDto) {
		const actor = await this.repository.findOneBy({ id: id });

		if (!actor) throw new NotFoundException('Actor not found');

		return this.repository.update(id, dto);
	}

	async delete(id: number) {
		const actor = await this.repository.findOneBy({ id: id });

		if (!actor) throw new NotFoundException('Actor not found');

		return this.repository.delete(id);
	}
}
