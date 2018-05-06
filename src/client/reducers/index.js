import { combineReducers } from 'redux';
import TestReducer from './reducers_test';

const rootReducer = combineReducers({
  test: TestReducer
});

export default rootReducer;
