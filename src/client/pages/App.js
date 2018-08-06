import React, { Component } from 'react';
import { connect } from 'react-redux'
import Main from '../containers/Main';

class App extends Component {
  render() {
    return (
			<div>
				<Main />
			</div>
    );
  }
}

export default connect(null, null)(App);
