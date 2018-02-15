import React, { Component } from 'react';
import { requestAllPolls } from './Requests';
import { Link } from 'react-router-dom';

export default class PollsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      polls: null,
      error: null,
      isLoaded: false,
    };
  }

  loadPolls = () => requestAllPolls().then(response => {
      this.setState({ polls: response.polls, isLoaded: true });
    }).catch(error => {
      this.setState({ error, isLoaded: true });
    });

  componentDidMount() {
    this.loadPolls();
  }

  render() {
    const { polls, isLoaded } = this.state;

    if (!isLoaded) {
      return null;
    }

    if (!polls) {
      return <p>No polls yet :(</p>;
    }

    return (
      <div>
        {Object.keys(polls).map((pollId) =>
          <p key={pollId}>
            <Link to={{ pathname: `/poll/${pollId}/${polls[pollId].creator}`, state: { poll: polls[pollId] } }}>{polls[pollId].title}</Link>
          </p>
        )}
      </div>
    );
  }
}
