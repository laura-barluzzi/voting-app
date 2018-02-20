import React, { PureComponent } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

import Button from './Button';
import PageTitle from './PageTitle';
import UserActions from './UserActions';

export default class Header extends PureComponent {

  render() {
    const { name, login, logout, email} = this.props;
    const isUserLoggedIn = name && email ? true : false;
    const title = isUserLoggedIn ? `Welcome ${name}!` : 'Join and create polls!';

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
              <Button text='Home' />
            </NavItem>
          </LinkContainer>
        </Nav>
        <UserActions name={name} email={email} logout={logout} login={login}/>
      </Navbar>
    );
  }
}
