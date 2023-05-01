import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class JwtAuthAdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requst = context.switchToHttp().getRequest<{ user: UserEntity }>();
		const user = requst.user;

		if (!user.isAdmin) throw new ForbiddenException('You have no rights!');

		return user.isAdmin;
	}
}
