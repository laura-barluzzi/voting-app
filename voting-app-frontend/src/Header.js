import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import LoginButton from './LoginButton';

export default class Main extends PureComponent {

  userActionLinks = (userEmail) => {
    const html =  <div><p><Link to="/create">Create poll</Link></p>
                  <p><Link to={`/${userEmail}/polls`}>My polls</Link></p></div>;
    return (userEmail) ? html : null;
  };

  render() {
    const { name, login, logout, email} = this.props;

    return (
      <div>
        <LoginButton name={name} login={login} logout={logout} />
        { this.userActionLinks(email) }
        <p><Link to="/">Home</Link></p>
        <hr/>
      </div>
    );
  }
}
