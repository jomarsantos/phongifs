import React, { Component } from 'react';
import { connect } from 'react-redux'
import { testFetchAction, testAction } from '../actions/test';
import TestComponent from '../components/TestComponent';

class Test extends Component {
	test() {
		if (this.props.testField == 'OFF') {
			this.props.testFetchAction();
		} else {
			this.props.testAction('OFF');
		}
	}

	render() {
		return(
			<div>
				<TestComponent testProp={this.props.testField} />
				<button onClick={() => { this.test() }}>TOGGLE</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
  return {
    testField: state.test.testField
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    testAction: (word) => {
      dispatch(testAction(word));
    },
		testFetchAction: () => {
      dispatch(testFetchAction());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
