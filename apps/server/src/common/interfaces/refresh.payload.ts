import * as jwt from 'jsonwebtoken';
import { UserRole } from '../enums';

export interface RefreshPayload extends jwt.JwtPayload {
  sub: string;
  tov: number;
  roles?: UserRole[];
}
