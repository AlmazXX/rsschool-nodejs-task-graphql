import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
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
  }),
});
