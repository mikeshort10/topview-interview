import React from 'react';
import { IStore, IOrder } from '../../state';
import { map, forEach, isEqual, reduce } from 'lodash';
import { connect } from 'react-redux';
import { IProduct } from '../../components/Bike';
import * as bikeRentals from '../../json/bikerentals.json';
import { Link } from 'react-router-dom';
import './index.scss';
import { bindActionCreators, Dispatch } from 'redux';
import { adjustQuantity } from '../../state/orders';

const insuranceInfo: IProduct = bikeRentals.products[5];

interface LineItemProps {
  kidHelmets: number;
  adultHelmets: number;
  totalBikes: number;
  order: IOrder;
  adjustQuantity: typeof adjustQuantity;
  location: string;
}

interface LineItemState {
  quantity: number;
}
class LineItem extends React.Component<LineItemProps, LineItemState> {
  constructor(props: LineItemProps) {
    super(props);
    this.state = { quantity: this.props.order.quantity };
  }

  adjustQuantity = (): void => {
    const { id } = this.props.order;
    const { quantity } = this.state;
    this.props.adjustQuantity(id, quantity);
  };

  updateQuantity = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { totalBikes, order, kidHelmets, adultHelmets } = this.props;
    let quantity = Math.max(+e.target.value, 0);
    if (isNaN(quantity)) {
      quantity = 0;
    }
    if (order.product_type === 'addon') {
      quantity = Math.min(quantity, totalBikes);
    } else if (order.id === 4) {
      quantity = Math.min(quantity, totalBikes - kidHelmets);
    } else if (order.id === 5) {
      quantity = Math.min(quantity, totalBikes - adultHelmets);
    }
    this.setState({ quantity });
  };

  inputOrDiv = () => {
    if (this.props.location === '/cart') {
      return (
        <input
          onChange={this.updateQuantity}
          onBlur={this.adjustQuantity}
          className="form-control"
          value={this.state.quantity}
        />
      );
    }
    return <div>{this.state.quantity}</div>;
  };

  render(): JSX.Element {
    const { product_type, quantity, name, price } = this.props.order;
    const label = product_type === 'addon' ? ` +   ${name}` : name;
    const padding = product_type === 'addon' ? 'pl-5' : '';
    return (
      <tr>
        <td key="name" className={padding}>
          {label}
        </td>
        <td key="price">{`$${price.toFixed(2)}`}</td>
        <td key="quantity" className="quantity-input">
          {this.inputOrDiv()}
        </td>
        <td key="total">{`$${(price * quantity).toFixed(2)}`}</td>
      </tr>
    );
  }
}

interface IStateProps {
  orders: IStore['orders'];
  location: string;
}

interface IDispatchProps {
  adjustQuantity: typeof adjustQuantity;
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
  renderRows = () => {
    const { orders } = this.props;
    const bikes = [orders[1], orders[2], orders[3]];
    const totalBikes = reduce(bikes, (total, bike) => total + bike.quantity, 0);
    const adultHelmets = orders[4].quantity;
    const kidHelmets = orders[5].quantity;
    const rows = map(orders, (order, i) => {
      if (!order.quantity) {
        return null;
      }
      const { quantity, insurance } = order;
      let insuranceLine: JSX.Element | null = null;
      if (insurance) {
        const insuranceProduct: IOrder = {
          ...insuranceInfo,
          quantity,
          insurance: 0
        };
        insuranceLine = (
          <LineItem
            key={i + 'insurance'}
            kidHelmets={kidHelmets}
            adultHelmets={adultHelmets}
            totalBikes={totalBikes}
            location={this.props.location}
            order={insuranceProduct}
            adjustQuantity={adjustQuantity}
          />
        );
      }
      return (
        <React.Fragment key={i}>
          <LineItem
            kidHelmets={kidHelmets}
            adultHelmets={adultHelmets}
            totalBikes={totalBikes}
            key={i}
            order={order}
            location={this.props.location}
            adjustQuantity={this.props.adjustQuantity}
          />
          {insuranceLine}
        </React.Fragment>
      );
    });
    return rows;
  };

  calculateTotalCost = () => {
    let totalCost = 0;
    forEach(this.props.orders, order => {
      const { insurance, price, quantity } = order;
      const insuranceCost = insurance ? +quantity * +insuranceInfo.price : 0;
      totalCost += +price * +quantity + insuranceCost;
      console.log(order.name, order, insuranceCost);
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

  render(): JSX.Element {
    const isCart = this.props.location === '/cart';
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
          <Link
            className="btn btn-primary"
            to={isCart ? '/checkout' : '/confirmation'}
          >
            {isCart ? 'Checkout' : 'Rent Bikes'}
          </Link>
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
  adjustQuantity: bindActionCreators(adjustQuantity, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
