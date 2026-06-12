import * as jwt from 'jsonwebtoken';
import { UserRole } from '../enums';

export interface AccessPayload extends jwt.JwtPayload {
  sub: string;
  roles: UserRole[];
  tov: number;
}
