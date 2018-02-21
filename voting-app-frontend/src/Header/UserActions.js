import React, { PureComponent } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

import Button from '../components/Button';

export default class UserActions extends PureComponent {

  render() {
    const { email, logout, login } = this.props;

    if (!email) return (
      <Nav pullRight>
        <LinkContainer to="#">
          <NavItem eventKey={2}>
            <Button onClicked={login} textKey="login" />
          </NavItem>
        </LinkContainer>
      </Nav>
    );

    return (
      <Nav pullRight>
        <LinkContainer to="#">
          <NavItem eventKey={3}>
            <Button onClicked={logout} textKey="logout" />
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/create">
          <NavItem eventKey={4}>
            <Button textKey="create" />
          </NavItem>
        </LinkContainer>
        <LinkContainer to={`/polls/${email}`}>
          <NavItem eventKey={5}>
            <Button textKey="myPolls" />
          </NavItem>
        </LinkContainer>
      </Nav>
    );
  }
}
