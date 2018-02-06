import React, { PureComponent } from 'react';
import request from 'request-promise';

export default class UserPolls extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      UserPolls: null,
      error: null,
      isLoaded: false,
    };
  }
  
  loadUserPolls = () => {
    const { email } = this.props
    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/${email}/polls`,
      json: true
    }).then(response => {
      this.setState({ UserPolls: response.polls, isLoaded: true });
    }).catch(error => {
      this.setState({ error, isLoaded: true });
    });
  }
  
  componentDidMount() {
    this.loadUserPolls();
  }
 
  render() {

    return (
      <div>
        <p> List here my polls </p>
      </div>
    );
  }
}
