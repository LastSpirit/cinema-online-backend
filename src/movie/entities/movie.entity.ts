import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { ActorEntity } from 'src/actor/entities/actor.entity';
import { GenreEntity } from 'src/genre/entities/genre.entity';

export class Parameters {
	@Column({ nullable: true })
	year?: number;

	@Column({ nullable: true })
	duration?: number;

	@Column({ nullable: true })
	country?: string;
}

@Entity('movie')
export class MovieEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	poster: string;

	@Column()
	bigPoster: string;

	@Column()
	title: string;

	@Column()
	slug: string;

	@Column()
	videoUrl: string;

	@Column({ default: false })
	isSendTelegram?: boolean;

	@Column({ default: 0 })
	rating?: number;

	@Column({ default: 0 })
	countOpened?: number;

	@Column(() => Parameters)
	parameters?: Parameters;

	@ManyToMany(() => GenreEntity, (genres) => genres.movies)
	@JoinTable()
	genres: GenreEntity[];

	@ManyToMany(() => ActorEntity, (actor) => actor.movies)
	@JoinTable()
	actors: ActorEntity[];
}
