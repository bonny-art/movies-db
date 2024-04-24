import { useContext, useEffect, useState } from "react";
import { fetchNextPage, resetMovies } from "./moviesSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Container, Grid, LinearProgress, Typography } from "@mui/material";
import { AuthContext, anonymousUser } from "../../AuthContext";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { Filters, MoviesFilter } from "./MoviesFilter";
import { MovieCard } from "./MovieCard";

function Movies() {
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.movies.top);
  const loading = useAppSelector((state) => state.movies.loading);
  const hasMorePages = useAppSelector((state) => state.movies.hasMorePages);

  const [filters, setFilters] = useState<Filters>();

  const { user } = useContext(AuthContext);
  const loggedIn = user !== anonymousUser;
  const [targetRef, entry] = useIntersectionObserver();

  //TODO add this code to the camper-rental-app project so that when you return to the page Catalog, the state is updated and the filters are not applied

  useEffect(() => {
    dispatch(resetMovies());
  }, [dispatch]);

  useEffect(() => {
    if (entry?.isIntersecting && hasMorePages) {
      const moviesFilters = filters
        ? {
            keywords: filters?.keywords.map((k) => k.id),
            genres: filters?.genres,
          }
        : undefined;

      dispatch(fetchNextPage(moviesFilters));
    }
  }, [dispatch, entry?.isIntersecting, filters, hasMorePages]);

  return (
    <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
      <Grid item xs="auto">
        <MoviesFilter
          onApply={(f) => {
            dispatch(resetMovies());
            setFilters(f);
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Container sx={{ py: 8 }} maxWidth="lg">
          {!loading && !movies.length && (
            <Typography variant="h6" align="center" gutterBottom>
              No movies were found that match your query.
            </Typography>
          )}

          <Grid container spacing={4}>
            {movies.map((m) => (
              <Grid item key={m.id} xs={12} sm={6} md={4}>
                <MovieCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  overview={m.overview}
                  popularity={m.popularity}
                  image={m.image}
                  enableUsersActions={loggedIn}
                />
              </Grid>
            ))}
          </Grid>
          <div ref={targetRef}>
            {loading && <LinearProgress color="secondary" sx={{ mt: 3 }} />}
          </div>
        </Container>
      </Grid>
    </Grid>
  );
}

export default Movies;
