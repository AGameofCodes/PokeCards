import type {Knex} from 'knex';
import UserRepository from './repository/UserRepository';
import User from './models/db/User';
import {randomUUID} from 'crypto';

export async function seedDb(knex: Knex): Promise<void> {
  await seedSystemUser();
  await seedAnonymousUser();
}

async function seedSystemUser(): Promise<User> {
  const userRepo = new UserRepository();
  let systemUser = await userRepo.getByName(User.SYSTEM_USER_NAME);
  if (!systemUser) {
    const uuid = randomUUID();
    systemUser = User.new(uuid, User.SYSTEM_USER_NAME, 'System', '', uuid);
    systemUser = await userRepo.add(systemUser);
  }
  return systemUser;
}

async function seedAnonymousUser(): Promise<User> {
  const userRepo = new UserRepository();
  let systemUser = await userRepo.getByName(User.ANONYMOUS_USER_NAME);
  if (!systemUser) {
    const uuid = randomUUID();
    systemUser = User.new(uuid, User.ANONYMOUS_USER_NAME, 'Anonymous', '', uuid);
    systemUser = await userRepo.add(systemUser);
  }
  return systemUser;
}
