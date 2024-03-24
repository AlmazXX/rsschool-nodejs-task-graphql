import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { buildContext } from './context/context.js';
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
      try {
        const errors = validate(schema, parse(source), [depthLimit(5)]);

        if (errors.length > 0) {
          return { errors };
        }
      } catch (error) {
        if (
          error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof error.message === 'string'
        ) {
          throw fastify.httpErrors.badRequest(`Invalid gql query. ${error.message}`);
        }
        throw new Error();
      }

      const response = await graphql({
        schema,
        source,
        variableValues,
        contextValue: buildContext(prisma),
      });

      return response;
    },
  });
};

export default plugin;
