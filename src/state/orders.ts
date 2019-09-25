import { Dispatch } from 'redux';
import { IState } from '../components/Bike';
import * as bikeRentals from '../json/bikerentals.json';
import { IAction, IOrders, IOrder } from './types';

const { products } = bikeRentals;

export const actionTypes = {
  ADD_TO_CART: 'ADD_TO_CART',
  ADJUST_QUANTITY: 'ADJUST_QUANTITY',
  ADD_CREDIT_CARD_INFO: 'ADD_CREDIT_CARD_INFO'
};

const addToCartAction = (payload: IState) => ({
  type: actionTypes.ADD_TO_CART,
  payload
});

const adjustQuantityAction = (id: number, quantity: number) => ({
  type: actionTypes.ADJUST_QUANTITY,
  payload: { id, quantity }
});

const createInitialOrder = (productNum: number): IOrder => ({
  ...products[productNum - 1],
  quantity: 0,
  insurance: 0
});

export const initialOrderState = {
  1: createInitialOrder(1),
  2: createInitialOrder(2),
  3: createInitialOrder(3),
  4: createInitialOrder(4),
  5: createInitialOrder(5)
};

export const orderReducer = (
  state: IOrders = initialOrderState,
  action: IAction<any>
): IOrders => {
  const handler = orderHandlers[action.type];
  const newState = handler ? handler(state, action.payload) : state;
  return newState;
};

const handleAddToCart = (state: IOrders, payload: IState) => {
  const orders = { ...state };
  const { id, bikes } = payload;
  if (payload.bikes) {
    const item: IOrder = { ...orders[id] };
    item.quantity += bikes;
    if (payload.insurance) {
      item.insurance += bikes;
    }
    orders[id] = item;
    if (payload.helmet && payload.adultHelmet) {
      orders[4].quantity += bikes;
    } else if (payload.helmet && !payload.adultHelmet) {
      orders[5].quantity += bikes;
    }
  }
  return orders;
};

const handleAdjustQuantity = (
  state: IOrders,
  payload: { id: number; quantity: number }
): IOrders => {
  const { id, quantity } = payload;
  console.log(quantity);
  const order = { ...state[id], quantity };
  return { ...state, [id]: order };
};

const orderHandlers = {
  [actionTypes.ADD_TO_CART]: handleAddToCart,
  [actionTypes.ADJUST_QUANTITY]: handleAdjustQuantity
};

export const addToCart = (payload: IState) => {
  return (dispatch: Dispatch) => {
    dispatch(addToCartAction(payload));
  };
};

export const adjustQuantity = (id: number, quantity: number) => (
  dispatch: Dispatch
) => {
  dispatch(adjustQuantityAction(id, quantity));
};
