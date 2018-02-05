import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Main extends PureComponent {
  render() {
    const { token } = this.props;

    if (token) {
      return (
        <Link to="/create-poll">Create poll</Link>
      )
    }

    return null;
  }
}
