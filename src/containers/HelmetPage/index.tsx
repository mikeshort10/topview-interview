import React from 'react';
import { map } from 'lodash';

export class HelmetPage extends React.Component {
  renderHelmets = () => {
    map(this.props.helmets);
  };
  render(): JSX.Element {
    return <div className="helmet-page">{this.renderHelmets()}</div>;
  }
}
