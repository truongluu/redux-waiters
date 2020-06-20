import { createAction } from 'redux-act';
import { createSelector } from 'reselect';

let id = 0;
export const createActionResources = (actionName) => {
  id += 1;
  const actionNameReplace = `[${id}] ${actionName}`;
  const start = createAction(actionNameReplace);
  const success = createAction(`${start}/success/@@end`);
  const error = createAction(`${start}/error/@@end`);

  return {
    id: start.toString(),
    start,
    success,
    error,
    waiterAction: (callback) => {
      return {
        type: start,
        callback,
      };
    },
  };
};

const waiterSelector = (state) => state.waiters;

export const isWaiting = (waiter) =>
  createSelector(waiterSelector, (waiters) => {
    return waiters.includes(waiter);
  });
export const anyWaiting = createSelector(waiterSelector, (waiters) => {
  return waiters.length > 0;
});
