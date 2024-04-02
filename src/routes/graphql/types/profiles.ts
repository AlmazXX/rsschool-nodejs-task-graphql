import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { Context } from '../context/context.js';
import { MEMBER_IDS, MemberType } from './members.js';
import { IUser, UserType } from './users.js';
import { UUIDType } from './uuid.js';

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: IUser['id'];
  memberTypeId: string;
}

export type IProfileInput = Omit<IProfile, 'id'>;

export const ProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MEMBER_IDS) },
  }),
});

export const ProfileUpdateInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MEMBER_IDS },
  }),
});

export const ProfileType = new GraphQLObjectType<IProfile, Context>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve: ({ userId }, _, { usersLoader }) => usersLoader.load(userId),
    },
    memberType: {
      type: MemberType,
      resolve: ({ memberTypeId }, _, { membersLoader }) =>
        membersLoader.load(memberTypeId),
    },
  }),
});

export const isProfileRecord = (record: unknown): record is IProfile => {
  return (
    !!record &&
    typeof record === 'object' &&
    'id' in record &&
    'isMale' in record &&
    'yearOfBirth' in record &&
    'userId' in record &&
    'memberTypeId' in record
  );
};
