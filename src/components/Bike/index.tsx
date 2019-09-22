import React from 'react';
import './index.scss';
import { IAddToCartPayload } from '../../state/redux';
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
  addToCart(product: IAddToCartPayload): void;
}

export interface ISetableStateProps {
  bikes?: number;
  adultHelmets?: number;
  kidsHelmets?: number;
  insurances?: number;
}

interface IAdjustQuantityProps {
  label: string;
  value: number;
  isMaxedOut: '' | 'disabled';
  changeQuantityByOne(change: 1 | -1): ClickEvent;
  changeQuantity(e: React.ChangeEvent<HTMLInputElement>): void;
}

function AdjustQuantity(props: IAdjustQuantityProps): JSX.Element {
  return (
    <div className="input-group w-100">
      <div className="input-group-prepend w-50">
        <div className="input-group-text w-100">{props.label}</div>
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
          className={`btn btn-success ${props.isMaxedOut}`}
          onClick={props.changeQuantityByOne(1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export interface IState {
  bikes: number;
  adultHelmets: number;
  kidsHelmets: number;
  insurances: number;
}

export class Bike extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { bikes: 0, adultHelmets: 0, kidsHelmets: 0, insurances: 0 };
  }

  changeQuantityByOne = (key: keyof IState) => (change: 1 | -1) => () => {
    const { bikes, adultHelmets, kidsHelmets, insurances } = this.state;
    const newProps: ISetableStateProps = {};
    let value: number = this.state[key] + change;
    value = Math.max(value, 0);
    if (key !== 'bikes') {
      if (this.isMaxedOut(key) === 'disabled' && change === 1) {
        return;
      }
      value = Math.min(value, bikes);
    } else if (key === 'bikes' && change === -1) {
      newProps.insurances = Math.min(insurances, value);
      const totalHelmets = Math.min(adultHelmets + kidsHelmets, value);
      newProps.kidsHelmets = Math.max(totalHelmets - adultHelmets, 0);
      newProps.adultHelmets = totalHelmets - newProps.kidsHelmets;
    }
    newProps[key] = value;
    this.setState(newProps as Pick<IState, typeof key>);
  };

  changeQuantity = (key: keyof IState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = +e.target.value;
    if (key !== 'bikes') {
      value = Math.min(value, this.state.bikes);
    }
    const newProps = { [key]: value };
    this.setState(newProps as Pick<IState, typeof key>);
  };

  renderAdjustQuantity = (label: string, key: keyof IState) => {
    return (
      <AdjustQuantity
        label={label}
        value={this.state[key]}
        isMaxedOut={this.isMaxedOut(key)}
        changeQuantity={this.changeQuantity(key)}
        changeQuantityByOne={this.changeQuantityByOne(key)}
      />
    );
  };

  isMaxedOut = (key: keyof IState) => {
    const { bikes, adultHelmets, kidsHelmets } = this.state;
    if (key === 'bikes') {
      return '';
    } else if (key !== 'insurances') {
      return bikes === adultHelmets + kidsHelmets ? 'disabled' : '';
    }
    return this.state.bikes <= this.state[key] ? 'disabled' : '';
  };

  addToCart = () => {
    const { addToCart, product } = this.props;
    const { id } = product;
    if (id === 1 || id === 2 || id === 3) {
      addToCart({ ...this.state, id });
    }
  };

  render(): JSX.Element {
    const { name, image } = this.props.product;
    return (
      <div className="bike">
        <img src={image} alt={name} />
        {this.renderAdjustQuantity(name, 'bikes')}
        {this.state.bikes
          ? this.renderAdjustQuantity(products[5].name, 'insurances')
          : null}
        <button className="btn btn-primary btn-block" onClick={this.addToCart}>
          Add to Cart
        </button>
      </div>
    );
  }
}
