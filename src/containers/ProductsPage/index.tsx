import React from 'react';
import { map } from 'lodash';
import { IProduct, Bike } from '../../components/Bike';
import * as bikerentals from '../../json/bikerentals.json';
import './index.scss';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addToCart } from '../../state/orders';

const { products } = bikerentals;

interface IDispatchProps {
  addToCart: typeof addToCart;
}

export class ProductsPage extends React.Component<IDispatchProps> {
  renderBikes = (): Array<JSX.Element | null> => {
    return map(products, (product: IProduct, i) => {
      if (product.product_type === 'bike') {
        return (
          <Bike key={i} product={product} addToCart={this.props.addToCart} />
        );
      }
      return null;
    });
  };

  render(): JSX.Element {
    console.log(this.props.addToCart);
    return <div className="products-page">{this.renderBikes()}</div>;
  }
}

const mapDispathToProps = (dispatch: Dispatch): IDispatchProps => ({
  addToCart: bindActionCreators(addToCart, dispatch)
});

export default connect(
  null,
  mapDispathToProps
)(ProductsPage);
