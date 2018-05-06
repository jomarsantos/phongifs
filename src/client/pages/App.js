import React, { Component } from 'react';
import { connect } from 'react-redux'
import Test from '../containers/Test';

class App extends Component {
  render() {
    return (
			<div>
				<Test />
			</div>
    );
  }
}

export default connect(null, null)(App);
