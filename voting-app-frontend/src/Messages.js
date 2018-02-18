import React, { Component } from 'react';

const Alert = require('react-bootstrap').Alert;

export default class Messages extends Component {

  render() {
    const { message, alertStyle} = this.props;

    if (!message) return null;

    return <Alert bsStyle={alertStyle || "info"}>{ message }</Alert>;
  }
}
