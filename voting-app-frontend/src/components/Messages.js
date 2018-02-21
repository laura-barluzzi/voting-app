import React, { Component } from 'react';

import Alert from 'react-bootstrap/lib/Alert';

export default class Messages extends Component {

  render() {
    const { message, alertStyle } = this.props;

    if (!message) return null;

    return <Alert bsStyle={alertStyle || "info"}>{ message }</Alert>;
  }
}
