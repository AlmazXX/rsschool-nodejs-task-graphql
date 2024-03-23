import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';

export enum IMemberType {
  BASIC = 'basic',
  BUSINESS = 'business',
}

export interface IMember {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export const MEMBER_IDS = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [IMemberType.BASIC]: { value: IMemberType.BASIC },
    [IMemberType.BUSINESS]: { value: IMemberType.BUSINESS },
  },
});

export const MemberType = new GraphQLObjectType<IMember>({
  name: 'Member',
  fields: () => ({
    id: { type: MEMBER_IDS },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});
