import React, { PureComponent } from 'react';

export default class LoginButton extends PureComponent {
  render() {
    const { name, logout, login } = this.props;

    if (name) {
      return (
        <div>
          <div>Welcome {name}!</div>
          <button onClick={logout}>Click to log out.</button>
        </div>
      )
    } else {
      return (
        <div>
          <button onClick={login}>Click to log in.</button>
        </div>
      )
    }
  }
}
