import React, { PureComponent } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

import { header } from '../domain/messages';

import Button from '../components/Button';
import PageTitle from '../components/PageTitle';
import UserActions from './UserActions';

export default class Header extends PureComponent {

  render() {
    const { name, login, logout, email} = this.props;
    const isUserLoggedIn = name && email ? true : false;
    const title = isUserLoggedIn ? header.loggedIn(name) : header.loggedOut;

    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <PageTitle title={title} />
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <LinkContainer to="/">
            <NavItem eventKey={1}>
              <Button textKey="home" />
            </NavItem>
          </LinkContainer>
        </Nav>
        <UserActions name={name} email={email} logout={logout} login={login} />
      </Navbar>
    );
  }
}
