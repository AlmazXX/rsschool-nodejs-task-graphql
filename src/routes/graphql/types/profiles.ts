import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { Context } from '../context/context.js';
import { memberType, membersEnum } from './members.js';
import { IUser, userType } from './users.js';
import { UUIDType } from './uuid.js';

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: IUser['id'];
  memberTypeId: string;
}

export type ProfileInput = Omit<IProfile, 'id'>;

export const profileInput = new GraphQLInputObjectType({
  name: 'ProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(membersEnum) },
  }),
});

export const profileUpdateInput = new GraphQLInputObjectType({
  name: 'ProfileUpdateInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: membersEnum },
  }),
});

export const profileType = new GraphQLObjectType<IProfile, Context>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: {
      type: userType,
      async resolve({ userId }, _, { usersLoader }) {
        return await usersLoader.load(userId);
      },
    },
    memberType: {
      type: memberType,
      async resolve({ memberTypeId }, _, { membersLoader }) {
        return await membersLoader.load(memberTypeId);
      },
    },
  }),
});
