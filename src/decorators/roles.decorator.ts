import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants';
import { UserRole } from '../users/enum/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
