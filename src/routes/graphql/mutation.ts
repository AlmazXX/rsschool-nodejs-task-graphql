import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { postInput, postType, postUpdateInput } from './types/posts.js';
import { profileInput, profileType, profileUpdateInput } from './types/profiles.js';
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
    createProfile: {
      type: profileType,
      args: {
        profile: { type: new GraphQLNonNull(profileInput) },
      },
    },
    updateProfile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        profile: { type: new GraphQLNonNull(profileUpdateInput) },
      },
    },
    deleteProfile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
  }),
});
