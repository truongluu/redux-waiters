import { createReducer } from 'redux-act';
import { createActionResources } from '../helpers';
import { delay } from '../helpers/utils';

const initialState = {
  counter: 0,
  error: false,
  errorMsg: '',
};

export const addNumberAction = createActionResources('add number');
export const minusNumberAction = createActionResources('minus number');

export default createReducer(
  {
    [addNumberAction.success]: (state) => {
      return {
        ...state,
        counter: state.counter + 1,
        error: false,
      };
    },
    [addNumberAction.error]: (state) => {
      return {
        ...state,
        error: true,
      };
    },
    [minusNumberAction.start]: (state) => {
      return {
        ...state,
        errorMsg: '',
        error: false,
      };
    },
    [minusNumberAction.success]: (state) => {
      return {
        ...state,
        counter: state.counter - 1,
      };
    },
    [minusNumberAction.error]: (state, errorMsg) => {
      return {
        ...state,
        error: true,
        errorMsg,
      };
    },
  },
  initialState,
);

export const addNumberCreator = () =>
  addNumberAction.waiterAction(async (dispatch) => {
    try {
      dispatch(addNumberAction.start());
      await delay(3000);
      dispatch(addNumberAction.success());
    } catch (err) {
      dispatch(addNumberAction.error());
    }
  });

export const minusNumberCreator = () =>
  minusNumberAction.waiterAction(async (dispatch) => {
    try {
      dispatch(minusNumberAction.start());
      await delay(3000);
      throw new Error('error occur when minus number');
    } catch (err) {
      dispatch(minusNumberAction.error(err.message));
    }
  });
