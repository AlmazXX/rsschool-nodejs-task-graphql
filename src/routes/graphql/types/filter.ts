import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { UUIDType } from './uuid.js';

export interface IFilter {
  id: string[];
}

export const FilterInput = new GraphQLInputObjectType({
  name: 'Filter',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UUIDType))),
    },
  }),
});
