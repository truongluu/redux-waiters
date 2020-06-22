# Redux Waiters

Waiter [middleware](https://redux.js.org/advanced/middleware) for Redux.

```js
npm install redux-waiters
```

## Motivation

Redux Waiter [middleware](https://redux.js.org/advanced/middleware) allows you
control all loading state of action creator when you call it.

## What’s a waiters?!

Inspired from [react-wait](https://classic.yarnpkg.com/en/package/react-wait),
[redux-thunk](https://classic.yarnpkg.com/en/package/redux-thunk). Thanks for
[Fatih Kadir Akın](https://github.com/f)

## Installation

```bash
npm install redux-waiters
```

Then, to enable Redux Waiters, use
[`applyMiddleware()`](https://redux.js.org/api/applymiddleware):

## Using

### In store

```js
import { createStore, applyMiddleware } from 'redux';
import waiter from 'redux-waiters';
import rootReducer from './reducers/index';

// Note: this API requires redux@>=3.1.0
const store = createStore(rootReducer, applyMiddleware(waiter));
```

### If you use it with redux-thunk

```js
import { createStore, applyMiddleware } from 'redux';
import waiter from 'redux-waiters';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

// Note: this API requires redux@>=3.1.0
const store = createStore(rootReducer, applyMiddleware(waiter, thunk));
```

### In rootReducer file

```js
import { combineReducers } from 'redux';
import { waiterReducer } from 'redux-waiters';

export defaut combineReducers({
...
waiter: waiterReducer
});
```

### In example counterReducer

```js
import { createActionResources, createReducer } from 'redux-waiters';
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
```

### Example code in your component file

```js
import { isWaiting, anyWaiting } from 'redux-waiters';
impport { Button } from 'antd';
import { addNumberCreator, minusNumerCreator, addNumberAction, minusNumberAction } from 'reducer/counterReducer';
function App({ adding, minusing, anyLoading }) {
  return (
    <>
      <h1>App Component</h1>
      <Button loading={adding}>Add number</Button>
      <Button loading={minusing}>Minus number</Button>
      {anyLoading ? 'Loading...' : ''}
    </>
  );
}

const isAddingNumerSelector = isWaiting(addNumberAction.id);
const isMinusingNumerSelector = isWaiting(minusNumberAction.id);

const mapStateToProps = (state) => {
  const {
    waiter
  } = state;
  return {
    adding: isAddingNumerSelector(waiter),
    minusing: isMinusingNumerSelector(waiter),
    anyLoading: anyWaiting(waiter)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNumber: () => dispatch(addNumberCreator()),
    minusNumber: () => dispatch(minusNumberCreator())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

## Injecting a Custom Argument

It's the same as redux-thunk, redux-waiters supports injecting a custom argument
using the `withExtraArgument` function:

```js
const store = createStore(
  reducer,
  applyMiddleware(waiter.withExtraArgument(api)),
);

// later
const fetchUser = (id) =>
  fetchUserAction.waiterAction(async (dispatch, getState, api) => {
    // you can use api here
  });
```

To pass multiple things, just wrap them in a single object. Using ES2015
shorthand property names can make this more concise.

```js
const api = 'http://www.example.com/sandwiches/';
const whatever = 42;

const store = createStore(
  reducer,
  applyMiddleware(waiter.withExtraArgument({ api, whatever })),
);

// later
const fetchUserCreator = (id) =>
  fetchUserAction.waiterAction(
    async (dispatch, getState, { api, whatever }) => {
      try {
        dispatch(fetchUserAction.start());
        dispatch(fetchUserAction.success());
      } catch (err) {
        dispatch(fetchUserAction.error());
      }
    },
  );
```

## Example code

[react-react-app with redux-waiters](https://github.com/truongluu/redux-waiters-example)

## License

MIT
