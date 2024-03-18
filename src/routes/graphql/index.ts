import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql } from 'graphql';
import { buildContext } from './context/context.js';
import rootValue from './resolvers/resolvers.js';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query: source, variables: variableValues } = req.body;

      const response = await graphql({
        schema,
        source,
        variableValues,
        rootValue,
        contextValue: buildContext(prisma),
      });

      return response;
    },
  });
};

export default plugin;
