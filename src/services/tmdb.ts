import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import configuration from "../configuration";

interface Configuration {
  images: {
    base_url: string;
  };
}

interface PageResponse<TResult> {
  results: TResult[];
  page: number;
  total_pages: number;
}

interface MovieDetails {
  id: number;
  title: string;
  popularity: number;
  overview: string;
  backdrop_path?: string;
}

interface MoviesState {
  results: MovieDetails[];
  lastPage: number;
  hasMorePages: boolean;
}

export interface MoviesFilters {
  keywords?: number[];
  genres?: number[];
}

export interface MoviesQuery {
  page: number;
  filters: MoviesFilters;
}

interface KeywordItem {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${configuration.apiUrl}/3`,
    prepareHeaders(headers) {
      headers.set("Accept", "application/json");
      headers.set("Authurozation", `Bearer ${configuration.apiToken}`);
    },
  }),
  endpoints: (builder) => ({
    getConfiguration: builder.query<Configuration, void>({
      query: () => "/configuration",
    }),

    getMovies: builder.query<MoviesState, MoviesQuery>({
      query: (moviesQuery) => {
        const { page, filters } = moviesQuery;

        const params = new URLSearchParams({
          page: page.toString(),
        });

        if (filters.keywords?.length) {
          params.append("with_keywords", filters.keywords.join("|"));
        }

        if (filters.genres?.length) {
          params.append("with_genres", filters.genres.join(","));
        }

        const query = params.toString();

        return `/discover/movie?${query}`;
      },
      transformResponse: (response: PageResponse<MovieDetails>, _, arg) => ({
        results: response.results,
        lastPage: response.page,
        hasMorePages: arg.page < response.total_pages,
      }),
    }),

    getKeywords: builder.query<KeywordItem[], string>({
      query: (query) => `/search/keyword?query=${query}`,
      transformResponse: (response: PageResponse<KeywordItem>) =>
        response.results,
    }),

    getGenres: builder.query<Genre[], void>({
      query: () => "/genre/movie/list",
      transformResponse: (response: { genres: Genre[] }) => response.genres,
    }),
  }),
});

export const {
  useGetConfigurationQuery,
  useGetMoviesQuery,
  useGetKeywordsQuery,
  useGetGenresQuery,
} = tmdbApi;
