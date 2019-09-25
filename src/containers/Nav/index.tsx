import React from 'react';
import { Link } from 'react-router-dom';

export class Nav extends React.Component {
  render(): JSX.Element {
    return (
      <div className="navbar navbar-expand-md bg-dark">
        <div className="navbar-brand">
          <Link to="/">
            <i className="fas fa-bicycle" />
            {` Mike's Bikes`}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#menu"
            aria-controls="menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Products
              </Link>
            </li>
            <Link className="nav-link" to="/cart">
              Cart
            </Link>
          </ul>
        </div>
      </div>
    );
  }
}
