import React from 'react';
import { IStore, IOrder, SubItemKeys, IOrders } from '../../state';
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
        <td key="total">{`$${((price * 100 * (quantity * 100)) / 10000).toFixed(
          2
        )}`}</td>
      </tr>
    );
  }
  return null;
}

interface LineItemProps {
  order: IOrder;
  adjustQuantity: typeof adjustQuantity;
  location: string;
  inputOrDiv(key: string): JSX.Element;
}

class LineItem extends React.Component<LineItemProps> {
  render(): JSX.Element {
    const { order } = this.props;
    const { product_type, name, ...passedProps } = order;
    const label = product_type === 'addon' ? ` +   ${name}` : name;
    const items: SubItemKeys[] = ['kidHelmet', 'adultHelmet', 'insurance'];
    const subItems = items.map((item, i) => {
      const product = products[i + 2];
      return (
        <Row
          key={i}
          padding={true}
          shouldRender={true}
          label={product.name}
          price={product.price}
          quantity={this.props.order[item]}
          inputOrDiv={this.props.inputOrDiv(item)}
        />
      );
    });
    return (
      <>
        <Row
          key={order.name}
          shouldRender={!!this.props.order.quantity}
          {...passedProps}
          label={label}
          padding={false}
          inputOrDiv={this.props.inputOrDiv('quantity')}
        />
        {subItems}
      </>
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
  orders: IOrders;
}

export class Cart extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { totalCost: 0, orders: { ...this.props.orders } };
  }

  updateStore = (id: number): BlurInput => e => {
    const order = this.props.orders[id];
    const { quantity, insurance, kidHelmet, adultHelmet } = order;
    order.insurance = Math.min(quantity, insurance);
    order.adultHelmet = Math.min(quantity, adultHelmet);
    order.kidHelmet = Math.min(quantity - order.adultHelmet, kidHelmet);
    order.kidHelmet = Math.max(order.kidHelmet, 0);
    this.props.adjustQuantity(this.state.orders[id]);
  };

  updateState = (
    id: number,
    key: SubItemKeys | 'quantity'
  ): ChangeInput => e => {
    const { quantity } = this.state.orders[id];
    const newProps: IOrder = {
      ...this.state.orders[id],
      [key]: Math.max(+e.target.value, 0)
    };
    if (key === 'insurance') {
      newProps[key] = Math.min(newProps[key], quantity);
    } else if (key !== 'quantity') {
      const otherHelmetKey: typeof key =
        key === 'adultHelmet' ? 'kidHelmet' : 'adultHelmet';
      const otherHelmet = this.state.orders[id][otherHelmetKey];
      newProps[key] = Math.min(newProps[key], quantity - otherHelmet);
    }
    this.setState({ orders: { ...this.state.orders, [id]: newProps } });
  };

  inputOrDiv = (id: number) => (key: SubItemKeys | 'quantity') => {
    const quantity = this.state.orders[id][key];
    if (this.props.location === '/cart') {
      return (
        <input
          onChange={this.updateState(id, key)}
          onBlur={this.updateStore(id)}
          className="form-control"
          value={quantity}
        />
      );
    }
    return <div>{quantity}</div>;
  };

  renderRows = (): Array<JSX.Element | null> => {
    const { orders } = this.props;
    return map(orders, (order, i) => {
      if (order.quantity) {
        return (
          <LineItem
            key={i}
            order={order}
            location={this.props.location}
            inputOrDiv={this.inputOrDiv(order.id)}
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
      totalCost += (price * 100 * (quantity * 100)) / 10000;
      totalCost += (kidHelmet * 100 * (products[2].price * 100)) / 10000;
      totalCost += (adultHelmet * 100 * (products[3].price * 100)) / 10000;
      totalCost += (insurance * 100 * (products[4].price * 100)) / 10000;
    });
    this.setState({ totalCost });
  };

  componentDidMount(): void {
    this.calculateTotalCost();
  }

  componentDidUpdate(newProps: IProps): void {
    const { orders } = this.props;
    if (!isEqual(newProps.orders, orders)) {
      this.calculateTotalCost();
      this.setState({ orders });
    }
  }

  checkoutOrPayInfo = () => {
    const className = 'btn btn-primary';
    const { location } = this.props;
    return location === '/cart' ? (
      <Link to="/checkout" className={className}>
        Checkout
      </Link>
    ) : (
      <button onClick={this.props.checkout} className={className}>
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
