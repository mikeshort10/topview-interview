import React from 'react';
import './index.scss';
import * as bikerentals from '../../json/bikerentals.json';

const { products } = bikerentals;

export type ClickEvent = (
  e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
) => void;

export interface IProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  product_type: string;
}

export interface IProps {
  product: IProduct;
  addToCart(order: IState): void;
}

function alternateColors(isTrue: boolean): string {
  return isTrue ? 'colorScheme' : 'inverseScheme';
}

interface IAdjustQuantityProps {
  value: number;
  price: number;
  changeQuantityByOne(change: 1 | -1): ClickEvent;
  changeQuantity(e: React.ChangeEvent<HTMLInputElement>): void;
}

function AdjustQuantity(props: IAdjustQuantityProps): JSX.Element {
  return (
    <div className="input-group w-100">
      <div className="input-group-prepend">
        <div className="input-group-text w-100">Quantity</div>
      </div>
      <input
        className="form-control"
        value={props.value}
        onChange={props.changeQuantity}
      />
      <div className="input-group-append">
        <button
          className={`btn btn-danger ${props.value === 0 ? 'disabled' : ''}`}
          onClick={props.changeQuantityByOne(-1)}
        >
          -
        </button>
        <button
          className={`btn btn-success`}
          onClick={props.changeQuantityByOne(1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

interface IHelmetProps {
  helmets: boolean;
  adultHelmet: boolean;
  handleAddOn(
    key: string,
    isAdded?: boolean
  ): (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function Helmets(props: IHelmetProps): JSX.Element | null {
  if (!props.helmets) {
    return null;
  }
  let productNum = 2;
  const helmets: JSX.Element[] = [];
  const selectedProduct = props.adultHelmet ? 3 : 4;
  while (productNum++ < 4) {
    const { name, price, image } = products[productNum];
    const color = alternateColors(selectedProduct === productNum);
    const selectAdult = !!(productNum - 4);
    helmets.push(
      <div key={productNum} className="helmets">
        <button
          onClick={props.handleAddOn('adultHelmet', selectAdult)}
          className={`helmets-caption ${color}`}
        >
          {`${name.slice(0, -7)} - $${price.toFixed(2)}`}
        </button>
        <img src={image} alt={name} />
      </div>
    );
  }
  return <div className="helmets-container">{helmets}</div>;
}

export interface IState {
  id: number;
  bikes: number;
  helmet: boolean;
  adultHelmet: boolean;
  insurance: boolean;
}

export class Bike extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      id: this.props.product.id,
      bikes: 1,
      helmet: false,
      adultHelmet: this.props.product.id !== 3,
      insurance: false
    };
  }

  changeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bikes: number = Math.max(+e.target.value, 0);
    this.setState({ bikes });
  };

  changeQuantityByOne = (change: 1 | -1) => (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    const bikes: number = Math.max(this.state.bikes + change, 0);
    this.setState({ bikes });
  };

  renderAdjustQuantity = (key: keyof IState) => {
    return (
      <AdjustQuantity
        value={this.state.bikes}
        price={this.props.product.price * this.state.bikes}
        changeQuantity={this.changeQuantity}
        changeQuantityByOne={this.changeQuantityByOne}
      />
    );
  };

  // isMaxedOut = (key: keyof IState) => {
  //   const { bikes, adultHelmet, kidsHelmets } = this.state;
  //   if (key === 'bikes') {
  //     return '';
  //   } else if (key !== 'insurances') {
  //     return bikes === adultHelmet + kidsHelmets ? 'disabled' : '';
  //   }
  //   return this.state.bikes <= this.state[key] ? 'disabled' : '';
  // };

  handleAddOn = (
    key: 'insurance' | 'helmet' | 'adultHelmet',
    isAdded?: boolean
  ) => (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    const value = isAdded !== undefined ? isAdded : !this.state[key];
    const newProps = { [key]: value };
    this.setState(newProps as Pick<IState, typeof key>);
  };

  include = (label: string, key: 'insurance' | 'helmet', price?: number) => {
    const isTrue = this.state[key];
    const formattedPrice = price ? `- $${price.toFixed(2)}` : ``;
    const text = isTrue ? 'Remove' : key === 'helmet' ? 'Choose' : 'Add';
    return (
      <>
        <button
          className={`w-50 ${alternateColors(isTrue)}`}
          onClick={this.handleAddOn(key)}
        >{`${text} ${label} ${formattedPrice}`}</button>
      </>
    );
  };

  addToCart = () => {
    const { addToCart, product } = this.props;
    const { id } = product;
    addToCart({ ...this.state, id });
  };

  render(): JSX.Element {
    const { name, image, price } = this.props.product;
    return (
      <div className="bike">
        <h2>{`${name} ($${price.toFixed(2)})`}</h2>
        <img src={image} alt={name} />
        {this.renderAdjustQuantity('bikes')}
        {this.state.bikes ? (
          <>
            <div className="include-boxes">
              {this.include('Insurance', 'insurance', products[5].price)}
              {this.include('Helmet', 'helmet')}
            </div>
            <Helmets
              helmets={this.state.helmet}
              adultHelmet={this.state.adultHelmet}
              handleAddOn={this.handleAddOn}
            />
          </>
        ) : null}
        <button className="btn btn-primary btn-block" onClick={this.addToCart}>
          Add to Cart
        </button>
      </div>
    );
  }
}
