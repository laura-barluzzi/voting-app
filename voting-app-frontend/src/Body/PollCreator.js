import React, { Component } from 'react';

import { requestNewPoll } from '../backend/Requests';

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

    const newPoll = JSON.parse(JSON.stringify({}));
    newPoll.title = title;
    newPoll.options = pollOptions;
    return  this.saveNewPoll(newPoll);
  }

  saveNewPoll = (newPoll) => requestNewPoll(newPoll, this.props.token)
    .then(response => {
      this.setState({ 
        poll: response,
        message: `Successfully created new poll titled: ${response.title}`,
        saved: true,
        error: null });})
    .catch(error => {
      this.setState({ error });
    });

  render() {
    const { poll, message, saved, error } = this.state;

    if (saved && poll) return <SuccessView id={poll.id} creator={poll.creator} message={message} />;

    return (
      <div>
        <Messages message={message} alertStyle={"danger"} />
        { error ? <p>{error.error.error}</p> : null }

        <PageTitle title='Creating a new poll' />
        <PollForm
          title=''
          options={['', '']}
          onSubmitForm={this.onSubmitForm}
        />
      </div>
    );
  }
}
