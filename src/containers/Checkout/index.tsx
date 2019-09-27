import React from 'react';
import { addCreditCardInfo } from '../../state/creditCard';
import { connect } from 'react-redux';
import './index.scss';
import { bindActionCreators, Dispatch } from 'redux';
import { IStore } from '../../state';

const errorMessages: ICreditCardInfo = {
  cardNum: 'please enter a 16 digit credit card number',
  cardName: 'please enter a valid name',
  cardExp: 'please enter a date on or after today',
  cvv: 'please enter a 3 digit CVV'
};

interface IDispatchProps {
  addCreditCardInfo: typeof addCreditCardInfo;
}
interface IStateProps {
  creditCardInfo: ICreditCardInfo;
}

interface IProps extends IDispatchProps, IStateProps {}

export interface ICreditCardInfo {
  cardNum: string;
  cvv: string;
  cardName: string;
  cardExp: string;
}

export class Checkout extends React.Component<IProps, ICreditCardInfo> {
  constructor(props: IProps) {
    super(props);
    this.state = this.props.creditCardInfo;
  }

  handleChange = (key: keyof ICreditCardInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newProps = { [key]: e.target.value };
    this.setState(newProps as Pick<ICreditCardInfo, typeof key>);
  };

  clickSubmitButton = () => {
    const { cardExp, cardName, cardNum, cvv } = this.state;
    const date = new Date(cardExp);
    const now = new Date();
    const firstOfTheMonth = Date.UTC(now.getFullYear(), now.getMonth());
    if (isNaN(+cardNum) || cardNum.length !== 16) {
      alert(`For Card Number, ${errorMessages.cardNum}`);
    } else if (cardName.length === 0) {
      alert(`For Name on Card, ${errorMessages.cardName}`);
    } else if (isNaN(+cvv) || cvv.length !== 3) {
      alert(`For CVV, ${errorMessages.cvv}`);
    } else if (!cardExp || date.getTime() < firstOfTheMonth) {
      alert(`For Expiration Date, ${errorMessages.cardExp}`);
    } else {
      this.props.addCreditCardInfo(this.state);
    }
  };

  renderInput = (
    key: keyof ICreditCardInfo,
    type: string,
    label: string
  ): JSX.Element => {
    const pattern = key === 'cardNum' ? '[0-9]{13,16}' : '.{1,}';
    const onInvalid = () => alert(`For ${label}, ${errorMessages[key]}`);
    const date = new Date();
    return (
      <React.Fragment key={key}>
        <label>{label}</label>
        <input
          pattern={pattern}
          onInvalid={onInvalid}
          className="form-control"
          required={true}
          type={type}
          max={`${date.getFullYear()}-${date.getMonth()}`}
          value={this.state[key]}
          onChange={this.handleChange(key)}
        />
      </React.Fragment>
    );
  };

  render(): JSX.Element {
    return (
      <form className="checkout">
        {this.renderInput('cardNum', 'text', 'Card Number')}
        {this.renderInput('cardName', 'text', 'Name on Card')}
        {this.renderInput('cvv', 'text', 'CVV')}
        {this.renderInput('cardExp', 'month', 'Expiration Date')}
        <button
          type="button"
          onClick={this.clickSubmitButton}
          className="btn btn-primary btn-block mt-3"
        >
          Review Order
        </button>
      </form>
    );
  }
}

const mapStateToProps = (state: IStore): IStateProps => ({
  creditCardInfo: state.creditCard
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  addCreditCardInfo: bindActionCreators(addCreditCardInfo, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checkout);
