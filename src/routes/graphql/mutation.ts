import { GraphQLObjectType } from 'graphql';
import { PostMutations } from './mutations/posts.js';
import { ProfileMutations } from './mutations/profiles.js';
import { UserMutations } from './mutations/users.js';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    user: {
      type: UserMutations,
      resolve: () => ({}),
    },
    post: {
      type: PostMutations,
      resolve: () => ({}),
    },
    profile: {
      type: ProfileMutations,
      resolve: () => ({}),
    },
  }),
});
