export interface JwtPayload {
  /**
   * @description user's uuid v4
   */
  sub: string;
  /**
   * @description loggedin user email
   */
  email: string;
  /**
   * @description loggedin user username
   */
  username: string;
}
