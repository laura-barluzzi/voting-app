import React, { Component } from 'react';
import request from 'request-promise';
import { Link } from 'react-router-dom';

export default class PollViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      poll: null,
      error: null,
    };
  }

  loadPoll = (pollId) => {
    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/polls/${pollId}`,
      json: true
    }).then(response => {
      this.setState({ poll: response.poll });
    }).catch(error => {
      this.setState({ error });
    });
  }

  componentDidMount() {
    const pollId = this.props.match.params.id;
    
    this.loadPoll(pollId);
  }

  showEditButton = (poll) => 
    <Link to={{ pathname: `/edit/${poll.id}`, state: { poll } }}>Edit</Link>

  addVote = (optionName) => {
    const { poll } = this.state;
    poll.options[optionName]++;

    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/vote`,
      json: true,
      method: 'POST',
      body: { poll },
    }).then(response => {
      this.setState({ poll: response.poll, error: null });
    }).catch(error => {
      this.setState({ error });
    });
  }

  render() {
    const { poll } = this.state;

    if (!poll) {
      return null;
    }

    return (
      <div>
        { this.props.email === poll.creator ? this.showEditButton(poll) : null }

        <p>Title: {poll.title}</p>
        <p>Creator: {poll.creator}</p>

        {Object.keys(poll.options).map((optionName, i) =>
          <p key={optionName}>
            {i}. {optionName} has {poll.options[optionName]} votes
            <button onClick={() => this.addVote(optionName)}>vote</button>
          </p>
        )}
      </div>
    );
  }
}
