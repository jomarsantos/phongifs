import { TEST } from '../actions/test';

const INITIAL_STATE = {
	testField: 'OFF',
};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {
	  case TEST:
	  	return { ...state, testField: action.word};
	  default:
	    return state;
  }
}
