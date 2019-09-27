import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store, history } from './state';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { Nav } from './containers/Nav';
import ProductsPage from './containers/ProductsPage';
import Cart from './containers/Cart';
import Checkout from './containers/Checkout';
import { Confirmation } from './containers/Confirmation';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Nav />
      <Switch>
        <Route path="/" exact={true} component={ProductsPage} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/review" component={Cart} />
        <Route path="/confirmation" component={Confirmation} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
