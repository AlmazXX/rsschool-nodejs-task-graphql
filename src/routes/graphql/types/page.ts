import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

export interface IPagination {
  page: number;
  perPage: number;
}

export class Pagination {
  public totalPages: number;
  public hasNextPage: boolean;
  public hasPreviousPage: boolean;

  constructor(
    public totalItems: number,
    public page: number,
    public perPage: number,
  ) {
    this.totalPages = this.countPages(totalItems, perPage);
    this.hasNextPage = this.hasNext(page, this.totalPages);
    this.hasPreviousPage = this.hasPrev(page);
  }

  private countPages(itemsCount: number, perPage: number) {
    const totalPages = Math.ceil(itemsCount / perPage);
    return totalPages;
  }

  private hasNext(page: number, totalPages: number) {
    return page < totalPages;
  }

  private hasPrev(page: number) {
    return page > 1;
  }

  static skip({ perPage, page }): number {
    return perPage * (page - 1);
  }
}

export const PaginationInputType = new GraphQLInputObjectType({
  name: 'PageInfoInput',
  fields: () => ({
    page: { type: GraphQLInt },
    perPage: { type: GraphQLInt },
  }),
});

export const PaginationType = new GraphQLObjectType({
  name: 'PageInfo',
  fields: () => ({
    totalPages: { type: new GraphQLNonNull(GraphQLInt) },
    totalItems: { type: new GraphQLNonNull(GraphQLInt) },
    page: { type: new GraphQLNonNull(GraphQLInt) },
    perPage: { type: new GraphQLNonNull(GraphQLInt) },
    hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
    hasPreviousPage: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
});
