import { Action } from "redux";

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

type ActionHandlers<S> = {
  [key: string]: (state: S, action: any) => S;
};

export function createReducer<TState>(
  initialState: TState,
  handlers: ActionHandlers<TState>
) {
  return function (state: TState, action: Action) {
    state ??= initialState; // state = state ?? initialState;
    const handler = handlers[action.type];

    // Instead of commented code, can be used a shorter entry
    // if (handler) {
    //   return handler(state, action);
    // }

    // return state;

    return handler?.(state, action) ?? state;
  };
}
