import { configureStore } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";
import {
  gelatoReducers,
  GELATO_PERSISTED_KEYS,
} from "@gelatonetwork/limit-orders-react";

// OPTIONAL: set the gelato persisted keys
// If don't use `redux-localstorage-simple` you can skip this step and only set the reducers
// You can also skip you don't use the GelatoLimitOrderPanel component
const PERSISTED_KEYS = [...GELATO_PERSISTED_KEYS];

const store = configureStore({
  reducer: {
    ...gelatoReducers,
  },
  middleware: [save({ states: PERSISTED_KEYS, debounce: 1000 })],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

export default store;