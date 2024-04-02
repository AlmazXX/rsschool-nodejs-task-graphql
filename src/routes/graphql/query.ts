import { Prisma } from '@prisma/client';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { HttpCompatibleError } from '../../plugins/handle-http-error.js';
import { Context } from './context/context.js';
import { FilterInput, IFilter } from './types/filter.js';
import { IMemberType, MEMBER_IDS, MemberType } from './types/members.js';
import { IPagination, Pagination, PaginationInputType } from './types/page.js';
import { ErrorPayload, PayloadInterface, SuccessQueryPayload } from './types/payload.js';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: PayloadInterface,
      args: {
        filter: { type: FilterInput },
        pagination: {
          type: PaginationInputType,
          defaultValue: { page: 1, perPage: 10 },
        },
      },
      resolve: async (
        _,
        { filter, pagination }: { filter: IFilter; pagination: IPagination },
        { prisma, authorsLoader, subscribersLoader }: Context,
        info,
      ) => {
        try {
          const parsedInfo = parseResolveInfo(info);

          const includesSubscriber = Object.keys(
            parsedInfo?.fieldsByTypeName?.User ?? {},
          ).includes('subscribedToUser');
          const includesAuthor = Object.keys(
            parsedInfo?.fieldsByTypeName?.User ?? {},
          ).includes('userSubscribedTo');

          const where = filter
            ? ({ id: { in: filter.id } } satisfies Prisma.UserWhereInput)
            : {};
          const include = {
            subscribedToUser: includesSubscriber,
            userSubscribedTo: includesAuthor,
          };
          const skip = Pagination.skip(pagination);
          const take = pagination.perPage;

          const { 0: users, 1: totalItems } = await prisma.$transaction([
            prisma.user.findMany({
              where,
              include,
              skip,
              take,
            }),
            prisma.user.count({ where }),
          ]);

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
              const authorIds = subscriber.userSubscribedTo.map(
                ({ authorId }) => authorId,
              );
              authorsLoader.prime(
                subscriber.id,
                users.filter((user) => authorIds.includes(user.id)),
              );
            });

          return new SuccessQueryPayload()
            .withItems(users)
            .withPagination({ totalItems, ...pagination });
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
    posts: {
      type: PayloadInterface,
      args: {
        filter: { type: FilterInput },
        pagination: {
          type: PaginationInputType,
          defaultValue: { page: 1, perPage: 10 },
        },
      },
      resolve: async (
        _,
        { filter, pagination }: { filter: IFilter; pagination: IPagination },
        { prisma }: Context,
      ) => {
        try {
          const where = filter
            ? ({ id: { in: filter.id } } satisfies Prisma.PostWhereInput)
            : {};
          const skip = Pagination.skip(pagination);
          const take = pagination.perPage;

          const { 0: posts, 1: totalItems } = await prisma.$transaction([
            prisma.post.findMany({
              where,
              skip,
              take,
            }),
            prisma.post.count({ where }),
          ]);

          return new SuccessQueryPayload()
            .withItems(posts)
            .withPagination({ totalItems, ...pagination });
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: (_, { prisma }: Context) => {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      args: {
        id: { type: MEMBER_IDS },
      },
      resolve: (_, { id }: { id: IMemberType }, { prisma }: Context) => {
        return prisma.memberType.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: PayloadInterface,
      args: {
        filter: { type: FilterInput },
        pagination: {
          type: PaginationInputType,
          defaultValue: { page: 1, perPage: 10 },
        },
      },
      resolve: async (
        { filter, pagination }: { filter: IFilter; pagination: IPagination },
        { prisma }: Context,
      ) => {
        try {
          const where = filter
            ? ({ id: { in: filter.id } } satisfies Prisma.ProfileWhereInput)
            : {};
          const skip = Pagination.skip(pagination);
          const take = pagination.perPage;

          const { 0: profiles, 1: totalItems } = await prisma.$transaction([
            prisma.profile.findMany({
              where,
              skip,
              take,
            }),
            prisma.profile.count({ where }),
          ]);

          return new SuccessQueryPayload()
            .withItems(profiles)
            .withPagination({ totalItems, ...pagination });
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
  }),
});
