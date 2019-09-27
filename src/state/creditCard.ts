import { Dispatch } from 'redux';
import { ICreditCardInfo } from '../containers/Checkout';
import { push } from 'connected-react-router';
import { IAction, IStore } from './types';
import { actionTypes, initialOrderState } from './orders';

export const initialStore: IStore = {
  router: {
    location: { pathname: '', state: '', hash: '', search: '' },
    action: 'REPLACE'
  },
  orders: initialOrderState(),
  creditCard: { cardNum: '', cardName: '', cardExp: '', cvv: '' }
};

const addCreditCardInfoAction = (
  creditCardInfo: ICreditCardInfo
): IAction<ICreditCardInfo> => ({
  type: actionTypes.ADD_CREDIT_CARD_INFO,
  payload: creditCardInfo
});

export const creditCardReducer = (
  state: ICreditCardInfo = initialStore.creditCard,
  action: IAction<any>
): ICreditCardInfo => {
  const handler = creditCardHandlers[action.type];
  const newState = handler ? handler(state, action.payload) : state;
  return newState;
};

const handleAddCreditCard = (
  state: ICreditCardInfo,
  payload: ICreditCardInfo
): ICreditCardInfo => {
  return payload;
};

const creditCardHandlers = {
  [actionTypes.ADD_CREDIT_CARD_INFO]: handleAddCreditCard
};

export const addCreditCardInfo = (creditCardInfo: ICreditCardInfo) => (
  dispatch: Dispatch
) => {
  dispatch(addCreditCardInfoAction(creditCardInfo));
  // preferably, do some credit card validation here
  // on success
  dispatch(push('/review'));
};
