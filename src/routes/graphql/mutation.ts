import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { postInput, postType, postUpdateInput } from './types/posts.js';
import { userInput, userType, userUpdateInput } from './types/users.js';
import { UUIDType } from './types/uuid.js';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        user: { type: new GraphQLNonNull(userInput) },
      },
    },
    updateUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        user: { type: new GraphQLNonNull(userUpdateInput) },
      },
    },
    deleteUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },

    createPost: {
      type: postType,
      args: {
        post: { type: new GraphQLNonNull(postInput) },
      },
    },
    updatePost: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        post: { type: new GraphQLNonNull(postUpdateInput) },
      },
    },
    deletePost: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
  }),
});
