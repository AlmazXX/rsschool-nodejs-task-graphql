import { GraphQLEnumType, GraphQLObjectType, GraphQLUnionType } from 'graphql';
import { HttpCompatibleError } from '../../../plugins/handle-http-error.js';
import { query } from '../query.js';
import { ErrorType } from './error.js';
import { PostType } from './posts.js';
import { UserType, isUserRecord } from './users.js';
import { UUIDType } from './uuid.js';

export enum IPayloadStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export class Payload {
  public query = {};
  public status!: IPayloadStatus;
  public record!: unknown;
  public recordId!: string;
  public error!: HttpCompatibleError;
  constructor() {}

  static withDefault() {
    return new Payload();
  }

  withRecord<T extends { id: string }>(record: T) {
    this.record = record;
    this.recordId = record.id;
    return this;
  }

  withStatus(status: IPayloadStatus) {
    this.status = status;
    return this;
  }

  withSuccess() {
    this.withStatus(IPayloadStatus.SUCCESS);
  }

  withFail() {
    this.withStatus(IPayloadStatus.FAIL);
  }

  withError(error: HttpCompatibleError) {
    this.error = error;
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
  types: () => [UserType, PostType],
  resolveType: (value) => {
    if (isUserRecord(value)) {
      return 'User';
    }
  },
});

export const PayloadType = new GraphQLObjectType({
  name: 'Payload',
  fields: () => ({
    record: { type: RecordUnion },
    recordId: { type: UUIDType },
    status: { type: PAYLOAD_STATUS },
    error: { type: ErrorType },
    query: { type: query },
  }),
});
