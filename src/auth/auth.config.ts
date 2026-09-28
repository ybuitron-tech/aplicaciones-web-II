export const jwtSecret = process.env.JWT_SECRET || 'mi_clave_123';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : 86400;

export const jwtOptions = () => ({
  secret: jwtSecret,
  signOptions: {
    expiresIn: jwtExpiresIn,
  },
});