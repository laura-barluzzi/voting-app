import React, { Component } from 'react';

import { requestNewPoll } from '../backend/Requests';
import { titlePages, success, failure } from '../domain/messages';

import Messages from '../components/Messages';
import PageTitle from '../components/PageTitle';
import PollForm from '../components/PollForm';
import SuccessView from './SuccessView';

export default class PollCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      poll: null,
      saved: false,
      message: '',
      error: null
    };
  }

  onSubmitForm = (title, options) => {
    const pollOptions = {};
    options.forEach((option) => pollOptions[option] = 0);

    if (options.length < 2)
      return this.setState({ message: 'Minimum 2 options required'});

    const newPoll = {};
    newPoll.title = title;
    newPoll.options = pollOptions;
    return  this.saveNewPoll(newPoll);
  }

  saveNewPoll = (newPoll) => requestNewPoll(newPoll, this.props.token)
    .then(response => {
      this.setState({ 
        poll: response,
        message: success.creating(response.title),
        saved: true,
        error: null });})
    .catch(error => {
      this.setState({ error, message: failure.creating });
    });

  render() {
    const { poll, message, saved, error } = this.state;
    const msgStyle = error ? "danger" : "success";

    if (saved && poll) return <SuccessView
        id={poll.id}
        creator={poll.creator}
        message={message}
        alertStyle={msgStyle}
      />;

    return (
      <div>
        <Messages message={message} alertStyle={msgStyle} />
        <PageTitle title={titlePages.pollCreator} />
        <PollForm
          title=''
          options={['', '']}
          onSubmitForm={this.onSubmitForm}
        />
      </div>
    );
  }
}