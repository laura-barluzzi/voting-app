import React, { Component } from 'react';

import { requestNewPoll, requestUpdatePoll } from './Requests';

import Messages from './Messages';
import PageTitle from './PageTitle';
import PollForm from './PollForm';
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
    const { editingPoll } = this.state;
    const { location } = this.props;

    const pollOptions = {};
    options.forEach((option) => pollOptions[option] = 0);

    if (options.length < 2)
      return this.setState({ message: 'Minimum 2 options required'});

    const newPoll = JSON.parse(JSON.stringify(location.state ? location.state.poll : {}));
    newPoll.title = title;
    newPoll.options = pollOptions;
    return  editingPoll ? this.saveChangedPoll(newPoll) : this.saveNewPoll(newPoll);
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

  saveChangedPoll = (newPoll) => requestUpdatePoll(newPoll, this.props.token)
    .then(response => {
      this.setState({ 
        poll: response,
        message: `Successfully edited poll with title: ${response.title}`,
        editingPoll: false,
        saved: true,
        error: null });
    })
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
