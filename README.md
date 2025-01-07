# GraphQL API Documentation

This document provides guidance on setting up, running, and using the GraphQL API, including making queries and mutations.

## Steps to get started:

1. Install dependencies:

```
npm ci
```

2. Create .env file based on the example:

```
cp .env.example .env
```

3. Create the database file:

```
touch ./prisma/database.db
```

4. Apply pending migrations:

```
npx prisma migrate deploy
```

5. Seed db:

```
npx prisma db seed
```

6. Start server:

```
npm run start
```

## Useful things:

- Database GUI: View and manage your database using Prisma Studio:

```
npx prisma studio
```

- Reset Database: If the database becomes too large or corrupted during testing, reset it (this also triggers seeding):

```
npx prisma migrate reset
```

- Swagger Documentation: Access the API documentation at /docs when the server is running.

## Using the GraphQL API

You can interact with the GraphQL API using tools like Apollo Studio, Postman, or Insomnia.

## Basic Structure

1. Queries: Retrieve data from the server.

2. Mutations: Modify or add data on the server.

### Queries

Fetch Users

This query retrieves a paginated list of users and their associated data:

```
query FetchUsers {
   users {
      status
      ...on SuccessQueryPayload {
         items {
            ...on User {
               id
               name
               balance
               posts {
                  id
                  title
               }
            }
         }
      }
      ...on ErrorPayload {
         error {
            message
            httpCode
         }
      }
   }
}
```

### Pagination Example

Fetch users with pagination:

```
query FetchUsers($page: Int!, $perPage: Int!) {
   users( pagination: { page: $page, perPage: $perPage }) {
      status
      ...on SuccessQueryPayload {
         items {
            ...on User {
               id
               name
               balance
            }
         }
         pagination {
            totalItems
            totalPages
            page
            perPage
            hasNextPage
            hasPreviousPage
         }
      }
      ...on ErrorPayload {
         error {
            message
            httpCode
         }
      }
   }
}
```

### Variables:

```json
{
  "page": 1,
  "perPage": 10
}
```

### Fetch User by ID

```
query FetchUser($userId: [UUID!]!) {
   users(filter: { id: $userId }) {
      status
      ...on SuccessQueryPayload {
         items {
            ...on User {
               id
               name
               balance
            }
         }
         pagination {
            totalItems
            page
            perPage
         }
      }
      ...on ErrorPayload {
         error {
            message
            httpCode
         }
      }
   }
}
```

### Variables:

```json
{
  "userId": "8fc48edb-58ed-48d0-a0b9-ccba87da7af5",
  // or
  "userId": [
    "8fc48edb-58ed-48d0-a0b9-ccba87da7af5",
    "8fc48edb-58ed-48d0-a0b9-ccba87da7af6"
  ]
}
```

## Mutations

### Create User

```
mutation CreateUser($dto: CreateUserInput!) {
   user {
      create(dto: $dto) {
         status
         ...on SuccessMutationPayload {
            record {
               ...on User {
                  id
                  balance
                  name
               }
            }
         }
         ...on ErrorPayload {
            error {
               message
               httpCode
            }
         }
      }
   }
}
```

### Variables:

```json
{
  "dto": {
    "name": "Alice",
    "balance": 100.0
  }
}
```

### Delete User

```
mutation DeleteUser($userId: [UUID!]!) {
   user {
      delete(id: $userId) {
         status
         ...on ErrorPayload {
            error {
               message
               httpCode
            }
         }
      }
   }
}
```

### Variables:

```json
{
  "userId": "8fc48edb-58ed-48d0-a0b9-ccba87da7af5",
  // or
  "userId": [
    "8fc48edb-58ed-48d0-a0b9-ccba87da7af5",
    "8fc48edb-58ed-48d0-a0b9-ccba87da7af6"
  ]
}
```

## Error Handling

The API uses ErrorPayload to return errors. If a query or mutation fails, the response will include:

```json
{
  "error": {
    "message": "Error description",
    "httpCode": "400",
    "name": "ErrorName"
  }
}
```

## Optimizations Implemented

1. **Query Complexity Limitation:**

   - The complexity of GraphQL queries is limited by their depth to ensure server stability and prevent resource exhaustion.
   - Depth limitations are configured to prevent excessively nested queries.

2. **N+1 Problem Solution:**
   - Data loading is optimized using `DataLoader`, which batches and caches database queries.
   - This ensures efficient resolution of related fields, such as fetching `posts` for users, minimizing redundant database queries.

By implementing these optimizations, the API provides robust and performant data fetching capabilities.
