import { createAction, createReducer } from 'redux-act';

const initialState = {
  waiters: [],
};

export const startWaitAction = createAction('start action');
export const endWaitAction = createAction('end action');

export default createReducer(
  {
    [startWaitAction]: (state, action) => {
      let waitersUpdate = state.waiters;
      if (!state.waiters.includes(action)) {
        waitersUpdate = [...state.waiters, action];
      }

      return {
        ...state,
        waiters: waitersUpdate,
      };
    },
    [endWaitAction]: (state, action) => {
      return {
        ...state,
        waiters: state.waiters.filter((waiter) => waiter !== action),
      };
    },
  },
  initialState,
);
