import React, { Component } from 'react';
import { requestOnePoll, requestUpdateVote } from './Requests';
import { Link } from 'react-router-dom';
import PollChart from './PollChart';

export default class PollViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      poll: null,
      error: null,
    };
  }

  loadPoll = (pollId) => requestOnePoll(pollId).then(response => {
      this.setState({ poll: response.poll });
    }).catch(error => {
      this.setState({ error });
    });

  addVote = (optionName) => {
    const { poll } = this.state;
    poll.options[optionName]++;

    requestUpdateVote(poll).then(response => {
      this.setState({ poll: response.poll, error: null });
    }).catch(error => {
      this.setState({ error });
    });
  }

  onBarClicked = (data) => this.addVote(data.name);

  componentDidMount() { this.loadPoll(this.props.match.params.id) }

  render() {
    const { poll } = this.state;

    if (!poll) {
      return null;
    }

    return (
      <div>
        { this.props.email !== poll.creator ? null : 
          <Link to={{ pathname: `/edit/${poll.id}`, state: { poll } }}>Edit</Link> }

        <p>Title: {poll.title}</p>
        <p>Creator: {poll.creator}</p>

        {Object.keys(poll.options).map((optionName, i) =>
          <p key={optionName}>
            {i}. {optionName} has {poll.options[optionName]} votes
            <button onClick={() => this.addVote(optionName)}>vote</button>
          </p>
        )}
        <PollChart poll={poll} onBarClicked={this.onBarClicked} />

      </div>
    );
  }
}
