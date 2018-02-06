import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import request from 'request-promise';


export default class UserPolls extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      userPolls: {},
      message: '',
      error: null,
      isLoaded: false,
    };
  }

  loadUserPolls = () => {
    const { email } = this.props;
    console.log(email);
    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/${email}/polls`,
      json: true
    }).then(response => {
      this.setState({ userPolls: response.polls, isLoaded: true });
    }).catch(error => {
      this.setState({ error, isLoaded: true });
    });
  }

  deletePoll = (pollId) => {
    const { token, email } = this.props;
    const { userPolls } = this.state;

    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/polls/${pollId}/${email}`,
      json: true,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(response => {
      if (response.deleted) {
        const deletedPoll = userPolls[pollId];
        const newPolls = Object.assign({}, userPolls);
        delete newPolls[pollId];
        this.setState({ userPolls: newPolls, message: `Poll ${deletedPoll.title} deleted.` })
      }
    }).catch(error => {
      this.setState({ error });
    });
  }

  componentDidMount() {
    this.loadUserPolls();
  }
 
  render() {
    const { userPolls, isLoaded, message } = this.state;

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
        { message ? message : null }
        {Object.keys(userPolls).map((pollId) =>
          <p key={pollId}>
            <Link to={`/poll/${pollId}`}>{userPolls[pollId].title}</Link>
            <button onClick={() => this.deletePoll(pollId)}>&times;</button>
          </p>
        )}
      </div>
    );
  }
}
