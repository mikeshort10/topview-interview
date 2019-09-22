import React from 'react';
import { map } from 'lodash';
import { IProduct, Bike } from '../../components/Bike';
import * as bikerentals from '../../json/bikerentals.json';
import './index.scss';
import { addToCart, IAddToCartPayload } from '../../state/redux';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const { products } = bikerentals;

interface IDispatchProps {
  addToCart: (product: IAddToCartPayload) => void;
}

export class ProductsPage extends React.Component<IDispatchProps> {
  renderBikes = (): Array<JSX.Element | null> => {
    return map(products, (product: IProduct, i) => {
      const { product_type } = product;
      if (product_type === 'bike') {
        return (
          <Bike key={i} product={product} addToCart={this.props.addToCart} />
        );
      }
      return null;
    });
  };

  render(): JSX.Element {
    console.log(this.props.addToCart);
    return (
      <>
        <div className="products-page">{this.renderBikes()}</div>
        <Link to="/cart" className="btn btn-primary float-right mx-5 mb-5">
          Procede to Checkout
        </Link>
      </>
    );
  }
}

const mapDispathToProps = (dispatch: Dispatch): IDispatchProps => ({
  addToCart: bindActionCreators(addToCart, dispatch)
});

export default connect(
  null,
  mapDispathToProps
)(ProductsPage);
