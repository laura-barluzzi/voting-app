import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { requestOnePoll, requestUpdateVote } from '../backend/Requests';

import Messages from '../components/Messages';
import PageTitle from '../components/PageTitle';
import PollChart from '../components/PollChart';
import PollFormVote from '../components/PollFormVote';

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
        <PageTitle title={poll.title} subTitle={`Created by ${poll.creator}`} />
        <PollFormVote options={poll.options} addVote={this.addVote} />
        <PollChart poll={poll} />
      </div>
    );
  }
}
