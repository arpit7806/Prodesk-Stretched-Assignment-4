import { configureStore } from "@reduxjs/toolkit";
import membersReducer from "./membersSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      members: membersReducer,
    },
  });
}
