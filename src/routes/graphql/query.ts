import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { postType } from './types/posts.js';
import { userType } from './types/users.js';
import { UUIDType } from './types/uuid.js';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
    },
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    posts: {
      type: new GraphQLList(postType),
    },
    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
  }),
});
