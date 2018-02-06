import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import request from 'request-promise';


export default class UserPolls extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      userPolls: null,
      error: null,
      isLoaded: false,
    };
  }
  
  loadUserPolls = () => {
    const { email } = this.props;
    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/${email}/polls`,
      json: true
    }).then(response => {
      this.setState({ userPolls: response.polls, isLoaded: true });
    }).catch(error => {
      this.setState({ error, isLoaded: true });
    });
  }
  
  componentDidMount() {
    this.loadUserPolls();
  }
 
  render() {
    const { userPolls, isLoaded } = this.state;

    if (!isLoaded) {
      return null;
    }

    if (!userPolls) {
      return (
        <div>
          <p>You don't have any poll yet</p>
          <Link to="/create">Create your first poll!</Link>
        </div>
      );
    }

    return (
      <div>
        <h3> My polls </h3>
        {Object.keys(userPolls).map((pollId) =>
          <p key={pollId}>
            <Link to={`/poll/${pollId}`}>{userPolls[pollId].title}</Link>
          </p>
        )}
      </div>
    );
  }
}
