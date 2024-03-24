import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { Context } from './context/context.js';
import { FilterInput, IFilter } from './types/filter.js';
import { IMemberType, MEMBER_IDS, MemberType } from './types/members.js';
import { PostType } from './types/posts.js';
import { ProfileType } from './types/profiles.js';
import { UserType } from './types/users.js';

export const query = new GraphQLObjectType<unknown, Context>({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      args: {
        filter: { type: FilterInput },
      },
      resolve: async (
        _,
        { filter }: { filter: IFilter },
        { prisma, subscribersLoader, authorsLoader },
        info,
      ) => {
        const parsedInfo = parseResolveInfo(info);

        const includesSubscriber = Object.keys(
          parsedInfo?.fieldsByTypeName?.User ?? {},
        ).includes('subscribedToUser');
        const includesAuthor = Object.keys(
          parsedInfo?.fieldsByTypeName?.User ?? {},
        ).includes('userSubscribedTo');

        const users = filter
          ? await prisma.user.findMany({
              where: { id: { in: filter.id } },
              include: {
                subscribedToUser: includesSubscriber,
                userSubscribedTo: includesAuthor,
              },
            })
          : await prisma.user.findMany({
              include: {
                subscribedToUser: includesSubscriber,
                userSubscribedTo: includesAuthor,
              },
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
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      args: {
        filter: { type: FilterInput },
      },
      resolve: (_, { filter }: { filter: IFilter }, { prisma }) =>
        filter
          ? prisma.post.findMany({ where: { id: { in: filter.id } } })
          : prisma.post.findMany(),
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: (_src, _args, { prisma }) => prisma.memberType.findMany(),
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      args: {
        id: { type: MEMBER_IDS },
      },
      resolve: (_, { id }: { id: IMemberType }, { prisma }) =>
        prisma.memberType.findUnique({ where: { id } }),
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      args: {
        filter: { type: FilterInput },
      },
      resolve: (_, { filter }: { filter: IFilter }, { prisma }) =>
        filter
          ? prisma.profile.findMany({ where: { id: { in: filter.id } } })
          : prisma.profile.findMany(),
    },
  }),
});
