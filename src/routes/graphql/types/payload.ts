import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLUnionType,
} from 'graphql';
import { HttpCompatibleError } from '../../../plugins/handle-http-error.js';
import { query } from '../query.js';
import { ErrorType } from './error.js';
import { Pagination, PaginationType } from './page.js';
import { PostType, isPostRecord } from './posts.js';
import { ProfileType, isProfileRecord } from './profiles.js';
import { UserType, isUserRecord } from './users.js';
import { UUIDType } from './uuid.js';

export enum IPayloadStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export class Payload {
  public status!: IPayloadStatus;
  constructor() {}

  withStatus(status: IPayloadStatus) {
    this.status = status;
    return this;
  }

  withSuccess() {
    this.withStatus(IPayloadStatus.SUCCESS);
    return this;
  }

  withFail() {
    this.withStatus(IPayloadStatus.FAIL);
    return this;
  }
}

export class SuccessMutationPayload extends Payload {
  public query = {};
  public record!: unknown;
  public recordId!: string;

  constructor() {
    super();
    this.withSuccess();
  }

  withRecord<T extends { id: string }>(record: T) {
    this.record = record;
    this.recordId = record.id;
    return this;
  }
}

export class SuccessQueryPayload extends Payload {
  public items!: unknown;
  public pagination!: Pagination;

  constructor() {
    super();
    this.withSuccess();
  }

  withItems<T>(items: T) {
    this.items = items;
    return this;
  }

  withPagination({
    totalItems,
    page,
    perPage,
  }: {
    totalItems: number;
    page: number;
    perPage: number;
  }) {
    this.pagination = new Pagination(totalItems, page, perPage);
    return this;
  }
}

export class ErrorPayload extends Payload {
  public error: HttpCompatibleError = { message: '', httpCode: '400', name: '' };

  constructor() {
    super();
    this.withFail();
  }

  withError(error: HttpCompatibleError) {
    this.error.message = error.message;
    this.error.httpCode = error.httpCode;
    this.error.name = error.name;
    return this;
  }
}

export const PAYLOAD_STATUS = new GraphQLEnumType({
  name: 'PayloadStatus',
  values: {
    [IPayloadStatus.SUCCESS]: { value: IPayloadStatus.SUCCESS },
    [IPayloadStatus.FAIL]: { value: IPayloadStatus.FAIL },
  },
});

const RecordUnion = new GraphQLUnionType({
  name: 'Record',
  types: () => [UserType, PostType, ProfileType],
  resolveType: (value) => {
    if (isUserRecord(value)) {
      return 'User';
    }
    if (isPostRecord(value)) {
      return 'Post';
    }
    if (isProfileRecord(value)) {
      return 'Profile';
    }
  },
});

export const PayloadInterface = new GraphQLInterfaceType({
  name: 'PayloadInterface',
  fields: () => ({
    status: { type: PAYLOAD_STATUS },
  }),
  resolveType: (value) => {
    if (value instanceof SuccessMutationPayload) {
      return 'SuccessMutationPayload';
    }
    if (value instanceof SuccessQueryPayload) {
      return 'SuccessQueryPayload';
    }
    if (value instanceof ErrorPayload) {
      return 'ErrorPayload';
    }
    return undefined;
  },
});

export const SuccessMutationPayloadType = new GraphQLObjectType({
  name: 'SuccessMutationPayload',
  fields: () => ({
    status: { type: PAYLOAD_STATUS },
    query: { type: new GraphQLNonNull(query), resolve: () => ({}) },
    record: { type: RecordUnion },
    recordId: { type: UUIDType },
  }),
  interfaces: [PayloadInterface],
});

export const SuccessQueryPayloadType = new GraphQLObjectType({
  name: 'SuccessQueryPayload',
  fields: () => ({
    status: { type: PAYLOAD_STATUS },
    items: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(RecordUnion))) },
    pagination: {
      type: PaginationType,
      resolve: ({ pagination }: SuccessQueryPayload) => pagination,
    },
  }),
  interfaces: [PayloadInterface],
});

export const ErrorPayloadType = new GraphQLObjectType({
  name: 'ErrorPayload',
  fields: () => ({
    status: { type: PAYLOAD_STATUS },
    error: { type: ErrorType },
  }),
  interfaces: [PayloadInterface],
});
