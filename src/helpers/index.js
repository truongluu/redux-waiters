import { createAction } from 'redux-act';
import { put } from 'redux-saga/effects';
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
    waiterActionForSaga: (handler) => {
      return function* (action) {
        if (action.continue) {
          return yield* handler(action)
        } else {
          yield put({
            type: start,
            callback: handler,
            action
          })
        }
      }
    }
  };
};

export const createActionCRUDResources = (actionName) => {
  return {
    fetch: createActionResources(`fetch ${actionName}`),
    create: createActionResources(`create ${actionName}`),
    update: createActionResources(`update ${actionName}`),
    delete: createActionResources(`delete ${actionName}`)
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
