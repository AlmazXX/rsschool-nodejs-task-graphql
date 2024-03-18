import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';

export enum MemberType {
  BASIC = 'basic',
  BUSINESS = 'business',
}

export interface IMember {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export const membersEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberType.BASIC]: { value: MemberType.BASIC },
    [MemberType.BUSINESS]: { value: MemberType.BUSINESS },
  },
});

export const memberType = new GraphQLObjectType<IMember>({
  name: 'Member',
  fields: () => ({
    id: { type: membersEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});
