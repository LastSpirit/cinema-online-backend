import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { GenreModule } from './genre/genre.module';
import { GenreEntity } from './genre/entities/genre.entity';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';
import { FileModule } from './file/file.module';
import { ActorModule } from './actor/actor.module';
import { ActorEntity } from './actor/entities/actor.entity';
import { MovieModule } from './movie/movie.module';
import { MovieEntity } from './movie/entities/movie.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'root123',
			database: 'online-cinema',
			entities: [UserEntity, GenreEntity, ActorEntity, MovieEntity],
			synchronize: true,
		}),
		AuthModule,
		UserModule,
		GenreModule,
		FileModule,
		ActorModule,
		MovieModule,
	],
	controllers: [AppController, FileController],
	providers: [AppService, FileService],
})
export class AppModule {}
