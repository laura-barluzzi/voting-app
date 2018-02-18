import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

export default class UserActions extends PureComponent {

  render() {
    const { email, logout, login } = this.props;

    if (!email) return (
      <Nav pullRight>
        <NavItem href="#">
          <Button onClicked={login} text='Log in' />
        </NavItem>
      </Nav>
    );

    return (
      <Nav pullRight>
        <NavItem href="#">
          <Button onClicked={logout} text='Logout' />
        </NavItem>
        <NavItem href="#">
          <Link to="/create"><Button text='Create poll' /></Link>
        </NavItem>
        <NavItem href="#">
          <Link to={`/polls/${email}`}><Button text='My polls' /></Link>
        </NavItem>
      </Nav>
    );
  }
}
