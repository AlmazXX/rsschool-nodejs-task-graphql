import { PrismaClient } from '@prisma/client';
import { IProfile, ProfileInput } from '../types/profiles.js';

export const profiles = async (_, context: PrismaClient): Promise<IProfile[]> => {
  return await context.profile.findMany();
};

export const profile = async (
  { id }: { id: string },
  context: PrismaClient,
): Promise<IProfile | null> => {
  return await context.profile.findUnique({ where: { id } });
};

export const createProfile = async (
  { profile }: { profile: ProfileInput },
  context: PrismaClient,
): Promise<IProfile> => {
  return await context.profile.create({ data: profile });
};

export const updateProfile = async (
  { id, profile }: { id: string; profile: Partial<ProfileInput> },
  context: PrismaClient,
): Promise<IProfile> => {
  return await context.profile.update({ where: { id }, data: profile });
};

export const deleteProfile = async (
  { id }: { id: string },
  context: PrismaClient,
): Promise<IProfile> => {
  return await context.profile.delete({ where: { id } });
};
