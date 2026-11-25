import { getJwtExpiresIn, getJwtSecret } from '../config/env';

export const jwtSecret = getJwtSecret();
export const jwtExpiresIn = getJwtExpiresIn();

export const jwtOptions = () => ({
  secret: jwtSecret,
  signOptions: {
    expiresIn: jwtExpiresIn,
  },
});
