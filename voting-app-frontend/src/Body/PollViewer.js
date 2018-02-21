import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { requestOnePoll, requestUpdateVote } from '../backend/Requests';
import { noPoll, success, failure } from '../domain/messages';

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
      message: '',
      isLoaded: false,
    };
  }

  loadPoll = (pollId, pollCreator) => requestOnePoll(pollId, pollCreator)
    .then(response => this.setState({ poll: response, isLoaded: true }))
    .catch(error => this.setState({ error, isLoaded: true, message: failure.fetchingPoll }));

  addVote = (optionName) => requestUpdateVote(this.state.poll, optionName)
    .then(response => this.setState({ poll: response, error: null, message: success.voting }))
    .catch(error => this.setState({ error, message: failure.voting }));

  componentDidMount() { this.loadPoll(this.props.match.params.id, this.props.match.params.email) }

  render() {
    const { poll, isLoaded, message, error } = this.state;
    const canEdit = poll && this.props.email === poll.creator ? true : false;
    const pathObj = poll ? {pathname: `/edit/${poll.id}`, state: {poll}} : null;
    const msgStyle = isLoaded && error ? 'danger' : 'success';

    if (!isLoaded) return null;
  
    if (!poll) return <Messages message={noPoll} alertStyle={'warning'} />;

    return (
      <div>
        <Messages message={message} alertStyle={msgStyle} />

        { canEdit ? <Link to={pathObj}> Edit </Link> : null }

        <PageTitle title={poll.title} subTitle={`Created by ${poll.creator}`} />
        <PollFormVote options={poll.options} addVote={this.addVote} />
        <PollChart poll={poll} />
      </div>
    );
  }
}
