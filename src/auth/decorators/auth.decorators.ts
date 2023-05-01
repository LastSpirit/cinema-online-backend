import { UseGuards, applyDecorators } from '@nestjs/common';

import { RoleType } from '../auth.interface';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { JwtAuthAdminGuard } from '../guards/admin.guard';

export const Auth = (role: RoleType = 'user') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, JwtAuthAdminGuard)
			: UseGuards(JwtAuthGuard),
	);
