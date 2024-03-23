import { GraphQLObjectType } from 'graphql';
import { PostMutations } from './resolvers/posts.js';
import { ProfileMutations } from './resolvers/profiles.js';
import { UserMutations } from './resolvers/users.js';

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
