import { MovieEntity } from 'src/movie/entities/movie.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('genre')
export class GenreEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ unique: true })
	slug: string;

	@Column()
	description: string;

	@Column()
	icon: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updateddAt: Date;

	@ManyToMany(() => MovieEntity, (movie) => movie.genres)
	movies: MovieEntity[];
}
