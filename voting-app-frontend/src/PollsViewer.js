import React, { Component } from 'react';
import request from 'request-promise';
import { Link } from 'react-router-dom';

export default class PollsViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      polls: null,
      error: null,
      isLoaded: false,
    };
  }

  loadPolls = () => {
    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/polls`,
      json: true
    }).then(response => {
      this.setState({ polls: response.polls, isLoaded: true });
    }).catch(error => {
      this.setState({ error, isLoaded: true });
    });
  }
  
  componentDidMount() {
    this.loadPolls();
  }

  render() {
    const { polls, isLoaded } = this.state;

    if (!isLoaded) {
      return null;
    }

    if (!polls) {
      return <p>No polls :(</p>;
    }

    return (
      <div>
        {Object.keys(polls).map((pollId) =>
          <p key={pollId}>
            <Link to={`/poll/${pollId}`}>{polls[pollId]}</Link>
          </p>
        )}
      </div>
    );
  }
}
