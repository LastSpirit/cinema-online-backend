import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private repository: Repository<UserEntity>,
	) {}

	create(dto: CreateUserDto) {
		return this.repository.save(dto);
	}

	async getUserByEmail(email: string) {
		const user = await this.repository.findOneBy({ email: email });
		return user;
	}

	async getUserById(id: number) {
		const user = await this.repository.findOneBy({ id: id });

		if (!user) throw new NotFoundException('User not found');

		return user;
	}

	updateProfile(id: number, dto: UpdateUserDto) {
		return this.repository.update(id, dto);
	}

	async getCount() {
		const [_, count] = await this.repository.findAndCount();
		return count;
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) {
			const users = this.repository
				.createQueryBuilder('u')
				.where('u.email ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
				.getMany();

			return users;
		}

		return this.repository.find();
	}

	delete(id: number) {
		return this.repository.delete(id);
	}
}
