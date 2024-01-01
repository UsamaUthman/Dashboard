import { api } from "./api";
import { User } from "../models/user.model";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      // Specify the type for the query result (User[])
      query: () => "/users",
      providesTags: ["User"],
    }),
  }),
});

// Export the API and types for better organization
export const { useGetUsersQuery } = usersApi;

// Export types for the queries

export type { User };
