import './index.scss';
import React from 'react';

export class Confirmation extends React.Component {
  render(): JSX.Element {
    return (
      <div className="text-center mt-5">
        <p>Thanks for renting bikes with Mike's Bikes! </p>
        <p>Your confirmation number is 1234567</p>
        <p>
          Come in any time to borrow our bikes! (I don't see us being too busy
          since we don't really exist)
        </p>
      </div>
    );
  }
}
