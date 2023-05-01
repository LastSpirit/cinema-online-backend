import { MovieEntity } from 'src/movie/entities/movie.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actor')
export class ActorEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	slug: string;

	@Column()
	photo: string;

	@ManyToMany(() => MovieEntity, (movie) => movie.actors)
	movies: MovieEntity[];
}
