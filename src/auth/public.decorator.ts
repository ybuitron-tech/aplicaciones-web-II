import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marca una ruta como pública para que el guard global de JWT la omita. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
