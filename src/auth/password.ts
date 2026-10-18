import { scrypt, randomBytes, timingSafeEqual } from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('base64');
    const N = 16384, r = 8, p = 1;
    scrypt(password, salt, 64, { N, r, p }, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(`scrypt$${N}$${r}$${p}$${salt}$${derivedKey.toString('base64')}`);
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [_, N, r, p, salt, key] = hash.split('$');
    if (!key) return resolve(false);
    
    const keyBuffer = Buffer.from(key, 'base64');
    scrypt(password, salt, keyBuffer.length, {
      N: parseInt(N, 10),
      r: parseInt(r, 10),
      p: parseInt(p, 10),
    }, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(timingSafeEqual(keyBuffer, derivedKey));
    });
  });
}