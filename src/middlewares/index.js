import { startWaitAction, endWaitAction } from '../reducers';

const createWaiterMiddleWare = (extraArgument) => {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'object' && typeof action.callback === 'function') {
      dispatch(startWaitAction(action.type.toString()));
      return action.callback(dispatch, getState, extraArgument);
    }
    if (
      typeof action.type === 'string' &&
      (action.type.endsWith('success/@@end') ||
        action.type.endsWith('error/@@end'))
    ) {
      dispatch(
        endWaitAction(
          action.type
            .replace(/(?:[^\]].*?\]\s+?)(.*)/, '$1')
            .replace(/\/success\/@@end|\/error\/@@end/, ''),
        ),
      );
    }
    return next(action);
  };
};

const waiter = createWaiterMiddleWare();
waiter.withExtraArgument = createWaiterMiddleWare;
export default waiter;
