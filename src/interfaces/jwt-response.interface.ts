import { JwtPayload } from './jwt-payload.interface';

export interface JwtResponse extends JwtPayload {
  /**
   * @description issued at timestamp
   */
  iat: number;
  /**
   * @description expired at timestamp
   */
  exp: number;
  /**
   * @description jwt issuer
   */
  iss: string;
}
