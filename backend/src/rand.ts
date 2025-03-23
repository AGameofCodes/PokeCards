import {randomString} from './util/string';

export function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function randomEmail(): string {
  return `${randomString(10)}@${randomString(10)}.${randomString(10)}`;
}