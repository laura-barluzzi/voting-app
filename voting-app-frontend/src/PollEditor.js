import React, { Component } from 'react';

import { requestUpdatePoll } from './Requests';

import Messages from './Messages';
import PageTitle from './PageTitle';
import PollForm from './PollForm';
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
        message: `Successfully edited poll with title: ${response.title}`,
        saved: true,
        error: null });
    })
    .catch(error => {
      this.setState({ error });
    });

  render() {
    const { poll, message, saved, error } = this.state;
    
    if (!poll) return <Messages message='Poll was not found' alertStyle={'danger'} />;

    if (saved && poll) return <SuccessView id={poll.id} creator={poll.creator} message={message} />;

    return (
      <div>
        <Messages message={message} alertStyle={"danger"} />
        { error ? <p>{error.error.error}</p> : null }

        <PageTitle title='Editing your poll' />
        <PollForm
          title={poll.title}
          options={Object.keys(poll.options)}
          onSubmitForm={this.onSubmitForm}
        />
      </div>
    );
  }
}
