import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux';

import configureStore from './store/configureStore.js';
import App from './pages/App';

import style from './styles/main.scss';

const store = configureStore();

document.addEventListener('DOMContentLoaded', function() {
	ReactDOM.render(
		<Provider store={store}>
	    <Router>
				<Switch>
					<Route exact path="/" component={App} />
					<Route render={() => <h1>Page not found</h1>} />
				</Switch>
	    </Router>

	  </Provider>,
	  document.getElementById('root')
	);
});
