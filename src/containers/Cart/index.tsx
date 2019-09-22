import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

export class Cart extends React.Component {
  render(): JSX.Element {
    return (
      <div className="cart-review w-90 mx-auto">
        <table className="table w-100">
          <thead>
            <td>Item</td>
            <td>Cost</td>
            <td>Quantity</td>
            <td>Total</td>
          </thead>
        </table>
        <div className="float-right mr-3">
          <Link to="/checkout" className="btn btn-primary m-1">
            Checkout
          </Link>
          <Link to="/" className="btn btn-secondary m-1">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  null
)(Cart);
