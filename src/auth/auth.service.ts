import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare, genSalt } from 'bcryptjs';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService,
	) {}

	async login(dto: CreateUserDto) {
		const user = await this.validateUser(dto);
		const tokens = await this.generateJwtTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}

	async register(dto: CreateUserDto) {
		const candidate = await this.usersService.getUserByEmail(dto.email);

		if (candidate) {
			throw new BadRequestException(
				'User with this email is already in the system',
			);
		}
		const salt = await genSalt(10);
		const user = await this.usersService.create({
			email: dto.email,
			password: await hash(dto.password, salt),
		});
		const tokens = await this.generateJwtTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException('Please sign in!');

		const result = await this.jwtService.verifyAsync(refreshToken);

		if (!result) throw new UnauthorizedException('Invalid token or expired!');

		const user = await this.usersService.getUserById(result.id);

		const tokens = await this.generateJwtTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}

	private async validateUser(dto: CreateUserDto) {
		const user = await this.usersService.getUserByEmail(dto.email);

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		const passwordEquals = await compare(dto.password, user.password);
		if (!passwordEquals) throw new UnauthorizedException('Invalid password');

		return user;
	}

	private async generateJwtTokens(userId: number) {
		const data = { id: userId };

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		});

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		});

		return { refreshToken, accessToken };
	}

	private returnUserFields(user: UserEntity) {
		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	}
}
