import React, { PureComponent } from 'react';

import Button from './Button';

export default class LoginButton extends PureComponent {
  render() {
    const { name, logout, login } = this.props;

    if (name) {
      return (
        <div>
          <div>Welcome {name}!</div>
          <Button onClicked={logout} text='Log out' />
        </div>
      );
    }

    return <Button onClicked={login} text='Log in' />;
  }
}
