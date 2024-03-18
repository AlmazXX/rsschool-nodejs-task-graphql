import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
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
  }),
});
