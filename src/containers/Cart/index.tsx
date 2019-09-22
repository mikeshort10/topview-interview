import React from 'react';

export class Cart extends React.Component {
  render(): JSX.Element {
    return (
      <table>
        <thead>
          <td>Item</td>
          <td>Cost</td>
          <td>Quantity</td>
          <td>Total</td>
        </thead>
      </table>
    );
  }
}
