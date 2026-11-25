const isProduction = process.env.NODE_ENV === 'production';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && isProduction) {
    throw new Error('JWT_SECRET es obligatorio cuando NODE_ENV=production');
  }
  return secret || 'mi_clave_123';
}

export function getJwtExpiresIn(): number {
  const raw = process.env.JWT_EXPIRES_IN;
  const parsed = raw ? parseInt(raw, 10) : 86400;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 86400;
}

export function getFrontendOrigins(): string[] | boolean {
  const raw = process.env.FRONTEND_ORIGIN;
  if (raw) {
    const origins = raw.split(',').map(o => o.trim()).filter(Boolean);
    if (origins.length) return origins;
  }
  if (isProduction) {
    throw new Error('FRONTEND_ORIGIN es obligatorio cuando NODE_ENV=production');
  }
  return true;
}
