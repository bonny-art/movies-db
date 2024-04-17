import { combineReducers } from "redux";

import moviesRedicer from "./features/Movies/moviesSlice";

const rootReducer = combineReducers({
  movies: moviesRedicer,
});

export default rootReducer;
