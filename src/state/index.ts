import { History, createBrowserHistory } from 'history';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { orderReducer } from './orders';
import { initialStore, creditCardReducer } from './creditCard';
import thunk from 'redux-thunk';

export * from './types';

const createRootReducer = (hist: History<any>) =>
  combineReducers({
    router: connectRouter(hist),
    orders: orderReducer,
    creditCard: creditCardReducer
  });

export const history = createBrowserHistory();

export const store = createStore(
  createRootReducer(history),
  initialStore,
  compose(applyMiddleware(routerMiddleware(history), thunk))
);
