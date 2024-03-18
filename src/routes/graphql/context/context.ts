import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { batchMembers } from '../resolvers/members.js';
import { batchPosts } from '../resolvers/posts.js';
import { batchProfiles } from '../resolvers/profiles.js';
import { batchUsers } from '../resolvers/users.js';
import { IMember } from '../types/members.js';
import { IPost } from '../types/posts.js';
import { IProfile } from '../types/profiles.js';
import { IUser } from '../types/users.js';

export interface Context {
  prisma: PrismaClient;
  postsLoader: DataLoader<string, IPost[]>;
  profilesLoader: DataLoader<string, IProfile>;
  usersLoader: DataLoader<string, IUser>;
  membersLoader: DataLoader<string, IMember>;
}

export const buildContext = (prisma: PrismaClient): Context => ({
  prisma,
  postsLoader: new DataLoader((keys) => batchPosts(keys, prisma)),
  profilesLoader: new DataLoader((keys) => batchProfiles(keys, prisma)),
  usersLoader: new DataLoader((keys) => batchUsers(keys, prisma)),
  membersLoader: new DataLoader((keys) => batchMembers(keys, prisma)),
});
