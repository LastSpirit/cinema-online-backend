import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

type DataType = keyof UserEntity;

export const User = createParamDecorator(
	(data: DataType, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		return data ? user[data] : user;
	},
);
