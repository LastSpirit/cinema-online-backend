import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { GenreEntity } from './entities/genre.entity';

@Module({
	providers: [GenreService],
	imports: [TypeOrmModule.forFeature([GenreEntity])],
	controllers: [GenreController],
})
export class GenreModule {}
