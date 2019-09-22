import { createStore, Action, applyMiddleware, Dispatch } from 'redux';
import thunk from 'redux-thunk';
import { IState } from '../components/Bike';

const actionTypes = {
  ADD_TO_CART: 'ADD_TO_CART'
};

export interface IAddToCartPayload extends IState {
  id: 1 | 2 | 3;
}

const addToCartAction = (payload: IAddToCartPayload) => ({
  type: actionTypes.ADD_TO_CART,
  payload
});

interface IAction<T> extends Action<string> {
  payload: T;
}

interface IBike {
  bikes: number;
  quantity: number;
}

interface IStore {
  1?: IBike;
  2?: IBike;
  3?: IBike;
  4?: number;
  5?: number;
}

const reducer = (state: IStore = {}, action: IAction<any>): IStore => {
  const handler = handlers[action.type];
  const newState = handler ? handler(state, action.payload) : state;
  console.log(newState);
  return newState;
};

const handleAddToCart = (state: IStore, payload: IAddToCartPayload): IStore => {
  const { id } = payload;
  const oldProduct: IAddToCartPayload = {
    bikes: 0,
    insurances: 0,
    adultHelmets: 0,
    kidsHelmets: 0,
    id,
    ...state[id]
  };
  const updatedProduct: IState = {
    bikes: oldProduct.bikes + payload.bikes,
    insurances: oldProduct.insurances + payload.insurances,
    adultHelmets: oldProduct.adultHelmets + payload.adultHelmets,
    kidsHelmets: oldProduct.kidsHelmets + payload.kidsHelmets
  };
  return { ...state, [id]: updatedProduct };
};

const handlers: { [key: string]: typeof handleAddToCart } = {
  [actionTypes.ADD_TO_CART]: handleAddToCart
};

export const addToCart = (payload: IAddToCartPayload) => {
  console.log(payload);
  return (dispatch: Dispatch) => {
    console.log(payload, dispatch);
    dispatch(addToCartAction(payload));
  };
};

export const store = createStore(reducer, applyMiddleware(thunk));
