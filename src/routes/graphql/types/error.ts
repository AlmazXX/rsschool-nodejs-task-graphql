import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const ErrorType = new GraphQLObjectType({
  name: 'Error',
  fields: () => ({
    message: { type: new GraphQLNonNull(GraphQLString) },
    httpCode: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
