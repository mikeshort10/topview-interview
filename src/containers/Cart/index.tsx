import React from 'react';
import { IStore, IOrder, SubItemKeys } from '../../state';
import { map, forEach, isEqual } from 'lodash';
import { connect } from 'react-redux';
import * as bikeRentals from '../../json/bikerentals.json';
import { Link } from 'react-router-dom';
import './index.scss';
import { bindActionCreators, Dispatch } from 'redux';
import { adjustQuantity, checkout } from '../../state/orders';

export type BlurInput = (e: React.FocusEvent<HTMLInputElement>) => void;
export type ChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => void;

const { products } = bikeRentals;

interface RowProps {
  padding: boolean;
  label: string;
  price: number;
  quantity: number;
  shouldRender: boolean;
  inputOrDiv: JSX.Element;
}

function Row(props: RowProps): JSX.Element | null {
  const { padding, label, price, quantity, shouldRender } = props;
  if (shouldRender) {
    return (
      <tr>
        <td key="name" className={padding ? 'pl-5' : ''}>
          {label}
        </td>
        <td key="price">{`$${price.toFixed(2)}`}</td>
        <td key="quantity" className="quantity-input">
          {props.inputOrDiv}
        </td>
        <td key="total">{`$${(price * quantity).toFixed(2)}`}</td>
      </tr>
    );
  }
  return null;
}

interface LineItemProps {
  order: IOrder;
  adjustQuantity: typeof adjustQuantity;
  location: string;
}

class LineItem extends React.Component<LineItemProps, IOrder> {
  constructor(props: LineItemProps) {
    super(props);
    this.state = { ...this.props.order };
  }

  adjustQuantity: BlurInput = e => {
    const { id } = this.props.order;
    const { quantity } = this.state;
    this.props.adjustQuantity(id, quantity);
  };

  updateQuantity: ChangeInput = e => {
    const { value } = e.target;
    console.log(value);
    const quantity = Math.max(+value, 0);
    this.setState({ quantity });
  };

  inputOrDiv = (onChange: ChangeInput, onBlur: BlurInput, quantity: number) => {
    if (this.props.location === '/cart') {
      return (
        <input
          onChange={onChange}
          onBlur={onBlur}
          className="form-control"
          value={quantity}
        />
      );
    }
    return <div>{quantity}</div>;
  };

  render(): JSX.Element {
    const { order } = this.props;
    const { product_type, name, quantity, ...passedProps } = order;
    const label = product_type === 'addon' ? ` +   ${name}` : name;
    return (
      <>
        <Row
          shouldRender={!!quantity}
          quantity={this.state.quantity}
          {...passedProps}
          label={label}
          padding={false}
          inputOrDiv={this.inputOrDiv(
            this.updateQuantity,
            this.adjustQuantity,
            this.state.quantity
          )}
        />
        <SubItem
          shouldRender={!!this.props.order.kidHelmet}
          order={order}
          subItemKey="kidHelmet"
          adjustQuantity={this.props.adjustQuantity}
          label={'Kids Helmet'}
          price={products[3].price}
          quantity={order.kidHelmet}
          inputOrDiv={this.inputOrDiv}
        />
        <SubItem
          shouldRender={!!this.props.order.adultHelmet}
          subItemKey="adultHelmet"
          order={order}
          adjustQuantity={this.props.adjustQuantity}
          label={'Adult Helmet'}
          price={products[4].price}
          quantity={order.adultHelmet}
          inputOrDiv={this.inputOrDiv}
        />
        <SubItem
          shouldRender={!!this.props.order.insurance}
          order={order}
          subItemKey="insurance"
          adjustQuantity={this.props.adjustQuantity}
          label={'Insurance'}
          price={products[5].price}
          quantity={order.insurance}
          inputOrDiv={this.inputOrDiv}
        />
      </>
    );
  }
}

interface SubItemProps {
  shouldRender: boolean;
  order: IOrder;
  quantity: number;
  price: number;
  label: string;
  subItemKey: SubItemKeys;
  adjustQuantity: typeof adjustQuantity;
  inputOrDiv(
    onChange: ChangeInput,
    onBlur: BlurInput,
    quantity: number
  ): JSX.Element;
}

interface SubItemState {
  quantity: number;
}

class SubItem extends React.Component<SubItemProps, SubItemState> {
  constructor(props: SubItemProps) {
    super(props);
    this.state = { quantity: this.props.quantity };
  }

  changeQuantity: ChangeInput = e => {
    const bikes = this.props.order.quantity;
    let quantity: number = +e.target.value;
    quantity = Math.min(bikes, quantity);
    quantity = Math.max(quantity, 0);
    this.setState({ quantity });
  };

  pushQuantityToStore: BlurInput = e => {
    const { subItemKey, order, quantity } = this.props;
    this.props.adjustQuantity(order.id, quantity, subItemKey);
  };

  render(): JSX.Element {
    const { inputOrDiv, quantity, ...props } = this.props;
    return (
      <Row
        {...props}
        quantity={this.state.quantity}
        padding={true}
        inputOrDiv={inputOrDiv(
          this.changeQuantity,
          this.pushQuantityToStore,
          this.state.quantity
        )}
      />
    );
  }
}

interface IStateProps {
  orders: IStore['orders'];
  location: string;
}

interface IDispatchProps {
  adjustQuantity: typeof adjustQuantity;
  checkout: typeof checkout;
}

interface IProps extends IStateProps, IDispatchProps {}

interface IState {
  totalCost: number;
}

export class Cart extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { totalCost: 0 };
  }
  renderRows = (): Array<JSX.Element | null> => {
    const { orders } = this.props;
    return map(orders, (order, i) => {
      if (order.quantity) {
        return (
          <LineItem
            key={i}
            order={order}
            location={this.props.location}
            adjustQuantity={this.props.adjustQuantity}
          />
        );
      }
      return null;
    });
  };

  calculateTotalCost = () => {
    let totalCost = 0;
    forEach(this.props.orders, order => {
      const { insurance, price, quantity, kidHelmet, adultHelmet } = order;
      totalCost += price * quantity;
      totalCost += kidHelmet * products[3].price;
      totalCost += adultHelmet * products[4].price;
      totalCost += insurance * products[5].price;
    });
    this.setState({ totalCost });
  };

  componentDidMount(): void {
    this.calculateTotalCost();
  }

  componentDidUpdate(newProps: IProps): void {
    if (!isEqual(newProps.orders, this.props.orders)) {
      this.calculateTotalCost();
    }
  }

  checkoutOrPayInfo = () => {
    const className = 'btn btn-primary';
    if (this.props.location === '/cart') {
      return (
        <Link to="/checkout" className={className}>
          Checkout
        </Link>
      );
    }
    return (
      <button onClick={this.props.checkout} className="btn btn-primary">
        Rent Bikes
      </button>
    );
  };

  render(): JSX.Element {
    if (!this.state.totalCost) {
      return (
        <div className="text-center m-5">
          <p>There are no bikes in your cart. </p>
          <Link className="btn btn-secondary" to="/">
            Continue Shopping
          </Link>
        </div>
      );
    }
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <td>Item</td>
              <td>Cost</td>
              <td>Quantity</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
            <tr>
              <td>Total</td>
              <td />
              <td />
              <td>{`$${this.state.totalCost.toFixed(2)}`}</td>
            </tr>
          </tbody>
        </table>
        <div className="checkout-buttons">
          {this.checkoutOrPayInfo()}
          <Link className="btn btn-secondary" to="/">
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: IStore): IStateProps => ({
  orders: state.orders,
  location: state.router.location.pathname
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  adjustQuantity: bindActionCreators(adjustQuantity, dispatch),
  checkout: bindActionCreators(checkout, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
