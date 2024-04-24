import { ActionWithPayload, createReducer } from "../redux/utils";

import { MoviesFilters, client } from "../../api/tmdb";
import { AppThunk } from "../../store";

import { genres } from "./genres";

export interface Movie {
  id: number;
  title: string;
  popularity: number;
  overview: string;
  image?: string;
}

export interface Genre {
  id: number;
  name: string;
}

interface MovieState {
  top: Movie[];
  loading: boolean;
  page: number;
  hasMorePages: boolean;
  genres: Genre[];
}

const initialState: MovieState = {
  top: [],
  loading: false,
  page: 0,
  hasMorePages: true,
  genres,
};

const moviesLoading = () => ({
  type: "movies/loading",
});

const moviesLoaded = (
  movies: Movie[],
  page: number,
  hasMorePages: boolean
) => ({
  type: "movies/loaded",
  payload: { movies, page, hasMorePages },
});

//TODO add this code to the camper-rental-app project so that when you return to the page Catalog, the state is updated and the filters are not applied

export const resetMovies = () => ({
  type: "movies/reset",
});

export function fetchNextPage(
  filters: MoviesFilters = {}
): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const nextPage = getState().movies.page + 1;
    dispatch(fetchPage(nextPage, filters));
  };
}

function fetchPage(
  page: number,
  filters: MoviesFilters
): AppThunk<Promise<void>> {
  return async (dispatch) => {
    dispatch(moviesLoading());

    // todo: single load per app
    const config = await client.getConfiguration();

    const moviesResponse = await client.getMovies(page, filters);

    const imageSize = "w780";

    const imageUrl = config.images.base_url;

    const mappedResults: Movie[] = moviesResponse.results.map((m) => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      popularity: m.popularity,
      image: m.backdrop_path
        ? `${imageUrl}${imageSize}${m.backdrop_path}`
        : undefined,
    }));

    const hasMorePages = moviesResponse.page < moviesResponse.totalPages;

    dispatch(moviesLoaded(mappedResults, page, hasMorePages));
  };
}

const moviesReducer = createReducer<MovieState>(initialState, {
  "movies/loading": (state, action: ActionWithPayload<boolean>) => {
    return {
      ...state,
      loading: true,
    };
  },
  "movies/loaded": (
    state,
    action: ActionWithPayload<{
      movies: Movie[];
      page: number;
      hasMorePages: boolean;
    }>
  ) => {
    return {
      ...state,
      top: [...state.top, ...action.payload.movies],
      page: action.payload.page,
      hasMorePages: action.payload.hasMorePages,
      loading: false,
    };
  },
  //TODO add this code to the camper-rental-app project so that when you return to the page Catalog, the state is updated and the filters are not applied

  "movies/reset": (state) => {
    return { ...initialState };
  },
});

export default moviesReducer;
