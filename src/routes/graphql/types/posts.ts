import { PrismaClient } from '@prisma/client';
import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { IUser, userType } from './users.js';
import { UUIDType } from './uuid.js';

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: IUser['id'];
}

export type PostInput = Omit<IPost, 'id'>;

export const postInput = new GraphQLInputObjectType({
  name: 'PostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLString },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const postUpdateInput = new GraphQLInputObjectType({
  name: 'PostUpdateInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

export const postType = new GraphQLObjectType<IPost, PrismaClient>({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {
      type: userType,
      async resolve({ authorId: id }, _, context) {
        return await context.user.findUnique({ where: { id } });
      },
    },
  }),
});
