import { IProduct } from '../components/Bike';
import { ICreditCardInfo } from '../containers/Checkout';
import { Action } from 'redux';
import { RouterState } from 'connected-react-router';

export interface IAction<T> extends Action<string> {
  payload: T;
}

export interface IOrder extends IProduct {
  quantity: number;
  insurance: number;
  adultHelmet: number;
  kidHelmet: number;
}

export interface IOrders {
  [key: number]: IOrder;
}

export interface IStore {
  router: RouterState;
  orders: IOrders;
  creditCard: ICreditCardInfo;
}

export type SubItemKeys = 'insurance' | 'adultHelmet' | 'kidHelmet';
