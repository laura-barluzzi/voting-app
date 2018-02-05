import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import LoginButton from './LoginButton';

export default class Main extends PureComponent {
  render() {
      const { name, login, logout} = this.props;
    return (
      <div>
        <LoginButton name={name} login={login} logout={logout} />
        <p><Link to="/create">Create poll</Link></p>
        <p><Link to="/">Home</Link></p>
        <hr/>
      </div>
    );
  }
}
