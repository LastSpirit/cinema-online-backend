import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieEntity } from './entities/movie.entity';

@Module({
	controllers: [MovieController],
	providers: [MovieService],
	imports: [TypeOrmModule.forFeature([MovieEntity])],
})
export class MovieModule {}
