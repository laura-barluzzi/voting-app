import React, { Component } from 'react';

import { requestUpdatePoll } from '../backend/Requests';
import {
  noPoll,
  editedWrong,
  editedSuccessfully,
  pollEditorTitle } from '../domain/messages';

import Messages from '../components/Messages';
import PageTitle from '../components/PageTitle';
import PollForm from '../components/PollForm';
import SuccessView from './SuccessView';

export default class PollCreator extends Component {
  constructor(props) {
    super(props);
    
    const { location } = this.props;
    const poll = location.state ? location.state.poll : null;

    this.state = {
      poll,
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

    const newPoll = JSON.parse(JSON.stringify(this.state.poll));
    newPoll.title = title;
    newPoll.options = pollOptions;
    return  this.saveChangedPoll(newPoll);
  }

  saveChangedPoll = (newPoll) => requestUpdatePoll(newPoll, this.props.token)
    .then(response => {
      this.setState({ 
        poll: response,
        message: editedSuccessfully(response.title),
        saved: true,
        error: null });
    })
    .catch(error => {
      this.setState({ error, message: editedWrong(this.state.poll.title) });
    });

  render() {
    const { poll, message, saved } = this.state;
    
    if (!poll) return <Messages message={noPoll} alertStyle={'danger'} />;

    if (saved && poll) return <SuccessView id={poll.id} creator={poll.creator} message={message} />;

    return (
      <div>
        <Messages message={message} alertStyle={"danger"} />
        <PageTitle title={pollEditorTitle} />
        <PollForm
          title={poll.title}
          options={Object.keys(poll.options)}
          onSubmitForm={this.onSubmitForm}
        />
      </div>
    );
  }
}
