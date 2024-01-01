import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import ActionTypeReducer from "./features/ActionTypeSlice";
import userSlice from "./features/userSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    [api.reducerPath]: api.reducer,
    actionType: ActionTypeReducer,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),

  devTools: true,
});
