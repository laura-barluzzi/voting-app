import React, { Component } from 'react';

export default class Messages extends Component {

  render() {
    const { message } = this.props;

    if (!message) return null;

    return <h5>{ message }</h5>;
  }
}
