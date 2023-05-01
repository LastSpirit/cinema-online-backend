import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MovieEntity } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MovieService {
	constructor(
		@InjectRepository(MovieEntity)
		private repository: Repository<MovieEntity>,
	) {}

	async findById(id: number) {
		const movie = await this.repository.findOneBy({ id: id });

		if (!movie) throw new NotFoundException('movie not found');

		return movie;
	}

	async getBySlug(slug: string) {
		const movie = await this.repository.findOne({
			where: {
				slug: slug,
			},
			relations: ['genres', 'actors'],
		});

		if (!movie) throw new NotFoundException('Genre not found');

		return movie;
	}

	async byGenres(genreIds: number[]) {
		const movies = await this.repository
			.createQueryBuilder('movies')
			.leftJoinAndSelect('movies.genres', 'genre')
			.where('genre.id IN (:...genreIds)', { genreIds })
			.getMany();

		return movies;
	}

	async byActor(actorId: number) {
		const movies = await this.repository
			.createQueryBuilder('movie')
			.leftJoinAndSelect('movie.actors', 'actor')
			.where('actor.id = :actorId', { actorId })
			.getMany();

		return movies;
	}

	async getMostPopular() {
		const moviesPopular = this.repository
			.createQueryBuilder('movies')
			.leftJoinAndSelect('movies.genres', 'genres')
			.where('movies.countOpened > 0')
			.orderBy('movies.countOpened', 'DESC')
			.getMany();

		return moviesPopular;
	}

	async create() {
		const defaultValue: CreateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		};

		const movie = await this.repository.save(defaultValue);
		return movie.id;
	}

	getAll(searchTerm?: string) {
		if (searchTerm) {
			const movies = this.repository
				.createQueryBuilder('movies')
				.leftJoinAndSelect('movies.genres', 'genres')
				.where('title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
				.getMany();

			return movies;
		}

		return this.repository.find({ relations: ['genres', 'actors'] });
	}

	async updateCountOpened(slug: string) {
		await this.repository
			.createQueryBuilder()
			.select()
			.whereInIds(slug)
			.update()
			.set({
				countOpened: () => 'countOpened + 1',
			})
			.execute();

		return this.repository.findOneBy({ slug: slug });
	}

	async update(id: number, dto: any) {
		const movie = await this.repository.findOne({
			relations: ['genres', 'actors'],
			where: { id: id },
		});

		if (!movie) throw new NotFoundException('movie not found');

		const newMoview = Object.assign(movie, dto);
		return this.repository.save(newMoview);
	}

	async delete(id: number) {
		const movie = await this.repository.findOneBy({ id: id });

		if (!movie) throw new NotFoundException('movie not found');

		return this.repository.delete(id);
	}
}
