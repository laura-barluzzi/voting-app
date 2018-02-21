import React, { PureComponent } from 'react';

import { requestDeletePoll, requestUserPolls } from '../backend/Requests';
import { deletePollById } from '../domain/domain';
import {
  noMyPolls,
  titlePages,
  success,
  failure } from '../domain/messages';

import ListGenerator from '../components/ListGenerator';
import Messages from '../components/Messages';
import PageTitle from '../components/PageTitle';

export default class UserPolls extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      userPolls: null,
      message: '',
      error: null,
      isLoaded: false,
    };
  }

  loadUserPolls = () => requestUserPolls(this.props.email, this.props.token)
    .then(response => this.setState({ userPolls: response.polls, isLoaded: true }))
    .catch(error => this.setState({ error, isLoaded: true, message: failure.fetchingPolls }))

  deletePoll = (poll) => requestDeletePoll(poll, this.props.token)
    .then(response => {
      if (response.deleted) {
        const newPolls =  deletePollById(this.state.userPolls, poll.id);
        const successMessage = success.deleting(poll.title);
        this.setState({ userPolls: newPolls, message: successMessage });
      }
    })
    .catch(error => this.setState({ error, message: failure.deleting }))

  componentDidMount() { this.loadUserPolls() }

  render() {
    const { userPolls, isLoaded, message, error } = this.state;
    const msgStyle = error ? 'danger' : 'success';

    if (!isLoaded) return null;

    if (!userPolls) return <Messages message={noMyPolls} alertStyle={'warning'} />;

    return (
      <div>
        <Messages message={message} alertStyle={msgStyle} />
        <PageTitle title={titlePages.userPolls} />
        <ListGenerator polls={userPolls} deletePoll={this.deletePoll} />
      </div>
    );
  }
}
