import React, { Component } from 'react';
import { UserAgentApplication, Logger } from 'msal';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import PollCreator from './PollCreator';
import PollViewer from './PollViewer';
import Main from './Main';
import UserPolls from './UserPolls';

const AdClient = 'e5fb9cfa-5e1a-4f3a-8b07-1828c1b64ba5';
const AdScopes = ['openid', 'profile'];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adToken: '',
      adUser: null,
    };
  }

  adApplication = new UserAgentApplication(
    AdClient,
    null,
    (errorMessage, token, error, tokenType) => {
      if (token) {
        this.adHandleToken(token);
      } else {
        this.adHandleError(error);
      }
    },
    {
      cacheLocation: 'localStorage',
      logger: new Logger((level, message) => {
        console.log(message);
      })
    }
  )
  
  adLogin = () => {
    this.adApplication.loginPopup(AdScopes)
    .then((idToken) => {
      this.adApplication.acquireTokenSilent(AdScopes)
      .then(this.adHandleToken)
      .catch((error) => {
        this.adApplication.acquireTokenPopup(AdScopes)
        .then(this.adHandleToken)
        .catch(this.adHandleError);
      });
    })
    .catch(this.adHandleError);
  }
  
  adLogout = () => {
    this.adApplication.logout();
  }

  adHandleError = (error) => {
    console.error(`AD: ${error}`);
  }

  adHandleToken = (token) => {
    const user = this.adApplication.getUser();

    this.setState({
      adUser: user,
      adToken: token,
    });
  }

  render() {
    const { adUser, adToken } = this.state;
    const email = adUser != null ? adUser.displayableId : null;
    console.log(adToken);
    return (
      <div>
        <Header
          name={adUser != null ? adUser.name : null}
          login={this.adLogin}
          logout={this.adLogout}
          email = {email}
        />

        <Switch>
          <Route exact path="/" render={(props) => <Main {...props} token={adToken} />} />
          <Route path="/create" render={(props) => <PollCreator {...props} token={adToken} />} />
          <Route path="/poll/:id" render={(props) => <PollViewer {...props} token={adToken} />} />
          <Route path="/polls/:email" render={(props) => <UserPolls {...props} token={adToken} email={email} />} />
        </Switch>
      </div>
    );
  }
}
