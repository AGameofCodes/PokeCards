const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function randomString(len: number): string {
  let ret = '';
  for (let i = 0; i < len; i++) {
    const j = Math.min(Math.floor(Math.random() * chars.length), chars.length - 1);
    ret += chars[j];
  }
  return ret;
}

export function randomStringBase64(len: number): string {
  return Buffer.from(randomString(len * 6 / 8)).toString('base64');
}