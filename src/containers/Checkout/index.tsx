import React from 'react';
import { addCreditCardInfo } from '../../state/creditCard';
import { connect } from 'react-redux';
import './index.scss';
import { bindActionCreators, Dispatch } from 'redux';
import { partial } from 'lodash';
import { IStore } from '../../state';

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

  renderInput = (
    key: keyof ICreditCardInfo,
    type: string,
    label: string
  ): JSX.Element => {
    const pattern = key === 'cardNum' ? '[0-9]{13,16}' : '.{1,}';
    return (
      <React.Fragment key={key}>
        <label>{label}</label>
        <input
          pattern={pattern}
          className="form-control"
          required={true}
          type={type}
          value={this.state[key]}
          onChange={this.handleChange(key)}
        />
      </React.Fragment>
    );
  };

  render(): JSX.Element {
    return (
      <form className="checkout" /* action="/api/check-card" method="POST" */>
        {this.renderInput('cardNum', 'text', 'Card Number')}
        {this.renderInput('cardName', 'text', 'Name on Card')}
        {this.renderInput('cvv', 'text', 'CVV')}
        {this.renderInput('cardExp', 'date', 'Expiration Date')}
        <button
          onClick={partial(this.props.addCreditCardInfo, this.state)}
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
