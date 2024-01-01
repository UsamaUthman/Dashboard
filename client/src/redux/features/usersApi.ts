import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {User} from "../models/user.model";

const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      // Specify the type for the query result (User[])
      query: () => '/users',
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;

// Export the API and types for better organization
export const { endpoints: { getUsers } } = usersApi;

// Export types for the queries
export type { User };

