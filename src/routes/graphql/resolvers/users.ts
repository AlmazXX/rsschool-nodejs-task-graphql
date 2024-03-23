import { PrismaClient } from '@prisma/client';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { HttpCompatibleError } from '../../../plugins/handle-http-error.js';
import { Context } from '../context/context.js';
import { Payload, PayloadType } from '../types/payload.js';
import { IUser, IUserInput, UserInput, UserUpdateInput } from '../types/users.js';
import { UUIDType } from '../types/uuid.js';

export const users = async (
  _,
  { prisma, subscribersLoader, authorsLoader }: Context,
  info: GraphQLResolveInfo,
): Promise<IUser[]> => {
  const parsedInfo = parseResolveInfo(info);

  const includesSubscriber = Object.keys(
    parsedInfo?.fieldsByTypeName?.User ?? {},
  ).includes('subscribedToUser');
  const includesAuthor = Object.keys(parsedInfo?.fieldsByTypeName?.User ?? {}).includes(
    'userSubscribedTo',
  );

  const users = await prisma.user.findMany({
    include: { subscribedToUser: includesSubscriber, userSubscribedTo: includesAuthor },
  });

  includesSubscriber &&
    users.forEach((author) => {
      const subscriberIds = author.subscribedToUser.map(
        ({ subscriberId }) => subscriberId,
      );
      subscribersLoader.prime(
        author.id,
        users.filter((user) => subscriberIds.includes(user.id)),
      );
    });

  includesAuthor &&
    users.forEach((subscriber) => {
      const authorIds = subscriber.userSubscribedTo.map(({ authorId }) => authorId);
      authorsLoader.prime(
        subscriber.id,
        users.filter((user) => authorIds.includes(user.id)),
      );
    });

  return users;
};

export const UserMutations = new GraphQLObjectType<unknown, Context>({
  name: 'UserMutations',
  fields: () => ({
    create: {
      type: new GraphQLNonNull(PayloadType),
      args: {
        dto: {
          type: new GraphQLNonNull(UserInput),
        },
      },
      resolve: async (_, { dto: data }: { dto: IUserInput }, { prisma }) => {
        const payload = Payload.withDefault();
        try {
          const item = await prisma.user.create({ data });
          payload.withSuccess();
          payload.withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            payload.withFail();
            payload.withError(error);
          }
        }
        return payload;
      },
    },
    change: {
      type: new GraphQLNonNull(PayloadType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(UserUpdateInput) },
      },
      resolve: async (
        _,
        { id, dto: data }: { id: string; dto: Partial<IUserInput> },
        { prisma },
      ) => {
        const payload = Payload.withDefault();
        try {
          const item = await prisma.user.update({ where: { id }, data });
          payload.withSuccess();
          payload.withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            payload.withFail();
            payload.withError(error);
          }
        }
        return payload;
      },
    },
    delete: {
      type: new GraphQLNonNull(PayloadType),
      args: {
        id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UUIDType))) },
      },
      resolve: async (_, { id }: { id: string[] }, { prisma }) => {
        const payload = Payload.withDefault();
        try {
          await prisma.user.deleteMany({ where: { id: { in: id } } });
          payload.withSuccess();
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            payload.withFail();
            payload.withError(error);
          }
        }
        return payload;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(PayloadType),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        {
          userId: id,
          authorId,
        }: {
          userId: string;
          authorId: string;
        },
        { prisma }: Context,
      ) => {
        const payload = Payload.withDefault();
        try {
          const item = await prisma.user.update({
            where: { id },
            data: { userSubscribedTo: { create: { authorId } } },
          });
          payload.withSuccess();
          payload.withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            payload.withFail();
            payload.withError(error);
          }
        }
        return payload;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(PayloadType),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        {
          userId,
          authorId,
        }: {
          userId: string;
          authorId: string;
        },
        { prisma }: Context,
      ) => {
        const payload = Payload.withDefault();
        try {
          await prisma.subscribersOnAuthors.delete({
            where: { subscriberId_authorId: { subscriberId: userId, authorId } },
          });
          payload.withSuccess();
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            payload.withFail();
            payload.withError(error);
          }
        }
        return payload;
      },
    },
  }),
});

export const batchUsers = async (userIds: readonly string[], prisma: PrismaClient) => {
  const users = await prisma.user.findMany({
    where: { id: { in: <string[]>userIds } },
  });

  const mappedUser = users.reduce<Record<string, IUser>>((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return userIds.map((id) => mappedUser[id] ?? null);
};

export const batchSubscribers = async (
  authorIds: readonly string[],
  prisma: PrismaClient,
) => {
  const subscribers = await prisma.user.findMany({
    where: { userSubscribedTo: { some: { authorId: { in: <string[]>authorIds } } } },
    include: { userSubscribedTo: true },
  });

  return authorIds.map((authorId) =>
    subscribers.filter((subscriber) =>
      subscriber.userSubscribedTo.some((sub) => sub.authorId === authorId),
    ),
  );
};

export const batchAuthors = async (
  subscriberIds: readonly string[],
  prisma: PrismaClient,
) => {
  const authors = await prisma.user.findMany({
    where: {
      subscribedToUser: { some: { subscriberId: { in: <string[]>subscriberIds } } },
    },
    include: { subscribedToUser: true },
  });

  return subscriberIds.map((subscriberId) =>
    authors.filter((author) =>
      author.subscribedToUser.some((sub) => sub.subscriberId === subscriberId),
    ),
  );
};
