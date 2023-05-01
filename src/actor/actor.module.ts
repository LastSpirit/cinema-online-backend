import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { ActorEntity } from './entities/actor.entity';

@Module({
	providers: [ActorService],
	controllers: [ActorController],
	imports: [TypeOrmModule.forFeature([ActorEntity])],
})
export class ActorModule {}
