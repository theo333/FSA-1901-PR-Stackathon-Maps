import React, { Component, Fragment } from 'react';
import Map from './Map';
import Header from './Header';

export default class extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Map />
      </Fragment>
    );
  }
}
