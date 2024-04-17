import { ActionWithPayload, createReducer } from "../redux/utils";

import { client } from "../../api/tmdb";
import { AppThunk } from "../../store";

export interface Movie {
  id: number;
  title: string;
  popularity: number;
  overview: string;
  image?: string;
}

interface MovieState {
  top: Movie[];
  loading: boolean;
}

const initialState: MovieState = {
  top: [],
  loading: false,
};

const moviesLoading = () => ({
  type: "movies/loading",
});

const moviesLoaded = (movies: Movie[]) => ({
  type: "movies/loaded",
  payload: movies,
});

export function fetchMovies(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    dispatch(moviesLoading());

    const config = await client.getConfiguration();
    const results = await client.getNowPlaying();

    const imageSize = "w780";

    const imageUrl = config.images.base_url;

    const mappedResults: Movie[] = results.map((m) => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      popularity: m.popularity,
      image: m.backdrop_path
        ? `${imageUrl}${imageSize}${m.backdrop_path}`
        : undefined,
    }));

    dispatch(moviesLoaded(mappedResults));
  };
}

const moviesReducer = createReducer<MovieState>(initialState, {
  "movies/loading": (state, action: ActionWithPayload<boolean>) => {
    return {
      ...state,
      loading: true,
    };
  },
  "movies/loaded": (state, action: ActionWithPayload<Movie[]>) => {
    return {
      ...state,
      top: action.payload,
      loading: false,
    };
  },
});

export default moviesReducer;
