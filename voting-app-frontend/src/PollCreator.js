import React, { Component } from 'react';

import { requestNewPoll, requestUpdatePoll } from './Requests';

import Messages from './Messages';
import PageTitle from './PageTitle';
import SuccessView from './SuccessView';
import PollForm from './PollForm';

export default class PollCreator extends Component {
  constructor(props) {
    super(props);
    
    const { location } = this.props;

    const startOptions = ['', ''];
    const options =  location.state ? Object.keys(location.state.poll.options) : startOptions;

    this.state = {
      pollId: null,
      pollCreator: null,
      error: null,
      message: '',
      editingPoll: this.props.location.state && this.props.location.state.poll ? true : false,
      saved: false,
      options
    };
  }

  onSubmitForm = (title, options) => {
    const { editingPoll } = this.state;
    const { location } = this.props;

    const pollOptions = {};
    options.forEach((option) => pollOptions[option] = 0);

    if (Object.keys(pollOptions).length < 2)
      return this.setState({ message: 'Minimum 2 options required'});

    const newPoll = JSON.parse(JSON.stringify(location.state ? location.state.poll : {}));
    newPoll.title = title;
    newPoll.options = pollOptions;
    return  editingPoll ? this.saveChangedPoll(newPoll) : this.saveNewPoll(newPoll);
  }

  saveNewPoll = (newPoll) => requestNewPoll(newPoll, this.props.token)
    .then(response => {
      this.setState({ 
        pollId: response.id,
        pollCreator: response.creator,
        message: `Successfully created new poll titled: ${response.title}`,
        saved: true,
        error: null });})
    .catch(error => {
      this.setState({ error });
    });

  saveChangedPoll = (newPoll) => requestUpdatePoll(newPoll, this.props.token)
    .then(response => {
      this.setState({ 
        pollId: response.id,
        pollCreator: response.creator,
        message: `Successfully edited poll with title: ${response.title}`,
        editingPoll: false,
        saved: true,
        error: null });
    })
    .catch(error => {
      this.setState({ error });
    });

  render() {
    const { error, pollId, options, pollCreator, message, editingPoll, saved } = this.state;
    const { location } = this.props;

    const pageTitle = editingPoll ? 'Editing your poll' : 'Creating a new poll';
    const title = location && location.state ? location.state.poll.title : '';

    if (saved && pollId) return <SuccessView id={pollId} creator={pollCreator} message={message} />;

    return (
      <div>
        <Messages message={message} alertStyle={"danger"} />
        { error ? <p>{error.error.error}</p> : null }

        <PageTitle title={pageTitle}/>
        <PollForm
          title={title}
          options={options}
          onSubmitForm={this.onSubmitForm}
        />
      </div>
    );
  }
}
