import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1" }); // base url for all endpoints

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 }); // retry the request 2 times if it fails

export const api = createApi({ // craete an api for all endpoints in the app we can use this api to create endpoints
  reducerPath: "api",

  baseQuery: baseQueryWithRetry,

  tagTypes: ["User"], // we can use this tag to get all users from the store ( we can also add more tags like this : ["User", "Post"] )

  endpoints: () => ({}), // we can add endpoints here but we will add them in the features folder for better organization
  
});

export const enhancedApi = api.enhanceEndpoints({ 
  endpoints: () => ({
    getPost: () => "test",
  }),
});
