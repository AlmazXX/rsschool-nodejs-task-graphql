import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';

export const ErrorType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Error',
  fields: () => ({
    message: { type: GraphQLString },
    httpCode: { type: GraphQLInt },
  }),
});
