import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';

export default class UserActions extends PureComponent {

  render() {
    const { email, logout, login } = this.props;

    if (!email) return <Button onClicked={login} text='Log in' />;

    return (
      <div>
        <Button onClicked={logout} text='Logout' />
        <Link to="/create"><Button text='Create poll' /></Link>
        <Link to={`/polls/${email}`}><Button text='My polls' /></Link>
      </div>
    );
  }
}
