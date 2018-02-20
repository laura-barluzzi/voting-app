import React, { PureComponent } from 'react';
import { LinkContainer } from 'react-router-bootstrap';

import Button from './Button';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

export default class UserActions extends PureComponent {

  render() {
    const { email, logout, login } = this.props;

    if (!email) return (
      <Nav pullRight>
        <LinkContainer to="#">
          <NavItem eventKey={2}>
            <Button onClicked={login} text='Log in' />
          </NavItem>
        </LinkContainer>
      </Nav>
    );

    return (
      <Nav pullRight>
        <LinkContainer to="#">
          <NavItem eventKey={3}>
            <Button onClicked={logout} text='Logout' />
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/create">
          <NavItem eventKey={4}>
            <Button text='Create poll' />
          </NavItem>
        </LinkContainer>
        <LinkContainer to={`/polls/${email}`}>
          <NavItem eventKey={5}>
            <Button text='My polls' />
          </NavItem>
        </LinkContainer>
      </Nav>
    );
  }
}
