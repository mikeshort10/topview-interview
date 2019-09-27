import { Dispatch } from 'redux';
import { IState } from '../components/Bike';
import * as bikeRentals from '../json/bikerentals.json';
import { IAction, IOrders, IOrder, SubItemKeys } from './types';
import { push } from 'connected-react-router';

const { products } = bikeRentals;

export const actionTypes = {
  ADD_TO_CART: 'ADD_TO_CART',
  ADJUST_QUANTITY: 'ADJUST_QUANTITY',
  ADD_CREDIT_CARD_INFO: 'ADD_CREDIT_CARD_INFO',
  ADJUST_SUBITEM: 'ADJUST_SUBITEM',
  CHECKOUT: 'CHECKOUT'
};

const checkoutAction = (): IAction<{}> => ({
  type: actionTypes.CHECKOUT,
  payload: {}
});

const addToCartAction = (payload: IState) => ({
  type: actionTypes.ADD_TO_CART,
  payload
});

const adjustQuantityAction = (
  id: number,
  quantity: number,
  subItemKey?: SubItemKeys
) => ({
  type: actionTypes.ADJUST_QUANTITY,
  payload: { id, quantity, subItemKey }
});

const createInitialOrder = (productNum: number): IOrder => ({
  ...products[productNum - 1],
  quantity: 0,
  insurance: 0,
  adultHelmet: 0,
  kidHelmet: 0
});

export const initialOrderState = () => ({
  1: createInitialOrder(1),
  2: createInitialOrder(2),
  3: createInitialOrder(3)
});

export const orderReducer = (
  state: IOrders = initialOrderState(),
  action: IAction<any>
): IOrders => {
  const handler = orderHandlers[action.type];
  const newState = handler ? handler(state, action.payload) : state;
  return newState;
};

const handleCheckout = (): IOrders => {
  return initialOrderState();
};

const handleAddToCart = (state: IOrders, payload: IState): IOrders => {
  const orders = { ...state };
  const { id, bikes, insurance, adultHelmet, helmet } = payload;
  if (payload.bikes) {
    const item: IOrder = { ...orders[id] };
    item.quantity += bikes;
    item.insurance += insurance ? bikes : 0;
    if (helmet && adultHelmet) {
      item.adultHelmet += bikes;
    } else if (helmet) {
      item.kidHelmet += bikes;
    }

    orders[id] = item;
  }
  return orders;
};

const handleAdjustQuantity = (
  state: IOrders,
  payload: {
    id: number;
    quantity: number;
    subItemKey?: SubItemKeys;
  }
): IOrders => {
  const { id, quantity, subItemKey } = payload;
  const key = subItemKey || 'quantity';
  const order = { ...state[id] };
  order[key] = quantity;
  return { ...state, [id]: order };
};

const orderHandlers = {
  [actionTypes.ADD_TO_CART]: handleAddToCart,
  [actionTypes.ADJUST_QUANTITY]: handleAdjustQuantity,
  [actionTypes.CHECKOUT]: handleCheckout
};

export const addToCart = (payload: IState) => {
  return (dispatch: Dispatch) => {
    dispatch(addToCartAction(payload));
  };
};

export const adjustQuantity = (
  id: number,
  quantity: number,
  subItemKey?: SubItemKeys
) => (dispatch: Dispatch) => {
  dispatch(adjustQuantityAction(id, quantity, subItemKey));
};

export const checkout = () => (dispatch: Dispatch) => {
  dispatch(checkoutAction());
  dispatch(push('/confirmation'));
};
