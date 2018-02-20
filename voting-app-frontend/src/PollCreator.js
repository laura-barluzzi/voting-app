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

    this.state = {
      poll: null,
      options: location.state ? Object.keys(location.state.poll.options) : ['', ''],
      editingPoll: location.state && location.state.poll ? true : false,
      message: '',
      saved: false,
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
    const { poll, message, editingPoll, saved, error } = this.state;

    const pageTitle = editingPoll ? 'Editing your poll' : 'Creating a new poll';

    if (saved && poll.id) return <SuccessView id={poll.id} creator={poll.creator} message={message} />;

    return (
      <div>
        <Messages message={message} alertStyle={"danger"} />
        { error ? <p>{error.error.error}</p> : null }

        <PageTitle title={pageTitle}/>
        <PollForm
          title={editingPoll ? this.props.location.state.poll.title : ''}
          options={this.state.options}
          onSubmitForm={this.onSubmitForm}
        />
      </div>
    );
  }
}
