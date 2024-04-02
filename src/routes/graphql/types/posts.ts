import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '../context/context.js';
import { IUser, UserType } from './users.js';
import { UUIDType } from './uuid.js';

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: IUser['id'];
}

export type IPostInput = Omit<IPost, 'id'>;

export const PostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const PostUpdateInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const PostType = new GraphQLObjectType<IPost, Context>({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {
      type: UserType,
      resolve: ({ authorId }, _, { usersLoader }) => usersLoader.load(authorId),
    },
  }),
});

export const isPostRecord = (record: unknown): record is IPost => {
  return (
    !!record &&
    typeof record === 'object' &&
    'id' in record &&
    'title' in record &&
    'content' in record &&
    'authorId' in record
  );
};
