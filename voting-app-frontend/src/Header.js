import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';
import PageTitle from './PageTitle';
import UserActions from './UserActions';

export default class Header extends PureComponent {

  render() {
    const { name, login, logout, email} = this.props;
    const isUserLoggedIn = name && email ? true : false;
    const title = isUserLoggedIn ? `Welcome ${name}!` : 'Join and create polls!';

    return (
      <div>
        <PageTitle title={title} />
        <UserActions name={name} email={email} logout={logout} login={login}/>
        <Link to="/"><Button text='Home' /></Link>
        <hr/>
      </div>

    );
  }
}
