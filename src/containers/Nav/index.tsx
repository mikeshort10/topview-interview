import React from 'react';
import { Link } from 'react-router-dom';

export class Nav extends React.Component {
  render(): JSX.Element {
    return (
      <div className="navbar navbar-expand-md bg-dark">
        <div className="navbar-brand">
          <Link to="/">
            <i className="fas fa-bicycle" />
          </Link>
          <Link to="/cart">
            <i className="fas fa-shopping-cart" />
          </Link>
        </div>
      </div>
    );
  }
}
