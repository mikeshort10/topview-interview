import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './state/redux';
import { Route, Switch, Router } from 'react-router';
import { Nav } from './containers/Nav';
import ProductsPage from './containers/BikesPage';
import { createBrowserHistory } from 'history';
import { Cart } from './containers/Cart';

ReactDOM.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      <Nav />
      <Switch>
        <Route path="/" exact={true} component={ProductsPage} />
        <Route path="/cart" component={Cart} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
