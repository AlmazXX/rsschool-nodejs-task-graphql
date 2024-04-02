import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema } from 'graphql';
import { mutation } from './mutation.js';
import { query } from './query.js';
import {
  ErrorPayloadType,
  SuccessMutationPayloadType,
  SuccessQueryPayloadType,
} from './types/payload.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const schema = new GraphQLSchema({
  query,
  mutation,
  types: [SuccessMutationPayloadType, SuccessQueryPayloadType, ErrorPayloadType],
});
