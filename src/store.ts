import { UnknownAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { tmdbApi } from "./services/tmdb";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { rickandmortyApi } from "./services/rickandmorty";

const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    [rickandmortyApi.reducerPath]: rickandmortyApi.reducer,
  },
  middleware: (getDefaultMiddlewaer) =>
    getDefaultMiddlewaer().concat(
      tmdbApi.middleware,
      rickandmortyApi.middleware
    ),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  UnknownAction
>;

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch<AppDispatch>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
