export function isDevEnv(): boolean {
  return process.env.NODE_ENV?.trim() === 'development';
}