import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { requestOnePoll, requestUpdateVote } from './Requests';
import Messages from './Messages';
import PollChart from './PollChart';
import PollFormVote from './PollFormVote';

export default class PollViewer extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;

    this.state = {
      poll: location.state ? location.state.poll : null,
      error: null,
      isLoaded: false,
    };
  }

  loadPoll = (pollId, pollCreator) => requestOnePoll(pollId, pollCreator)
    .then(response => this.setState({ poll: response, isLoaded: true }))
    .catch(error => this.setState({ error, isLoaded: true }));

  addVote = (optionName) => requestUpdateVote(this.state.poll, optionName)
    .then(response => this.setState({ poll: response, error: null }))
    .catch(error => this.setState({ error }));

  componentDidMount() { this.loadPoll(this.props.match.params.id, this.props.match.params.email) }

  render() {
    const { poll, isLoaded } = this.state;

    if (!isLoaded) return null;
  
    if (!poll) {
      return <Messages message='We could not find the poll :(' alertStyle={"info"}  />;
    }

    return (
      <div>
        { this.props.email !== poll.creator ? null : 
          <Link to={{ pathname: `/edit/${poll.id}`, state: { poll } }}>Edit</Link> }

        <PollFormVote poll={poll} addVote={this.addVote} />
        <PollChart poll={poll} />
      </div>
    );
  }
}
