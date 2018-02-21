import React, { PureComponent } from 'react';

import { requestDeletePoll, requestUserPolls } from '../backend/Requests';
import { deletePollById } from '../domain/domain';
import {
  noMyPolls,
  userPollList,
  fetchingPollsWrong,
  deletedPollWrong,
  deletedPollSuccessfully } from '../domain/messages';

import ListGenerator from '../components/ListGenerator';
import PageTitle from '../components/PageTitle';
import Messages from '../components/Messages';

export default class UserPolls extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      userPolls: {},
      message: '',
      error: null,
      isLoaded: false,
    };
  }

  loadUserPolls = () => requestUserPolls(this.props.email, this.props.token)
    .then(response => this.setState({ userPolls: response.polls, isLoaded: true }))
    .catch(error => this.setState({ error, isLoaded: true, message: fetchingPollsWrong }))

  deletePoll = (poll) => requestDeletePoll(poll, this.props.token)
    .then(response => {
      if (response.deleted) {
        const newPolls =  deletePollById(this.state.userPolls, poll.id);
        const successMessage = deletedPollSuccessfully(poll.title);
        this.setState({ userPolls: newPolls, message: successMessage });
      }
    })
    .catch(error => this.setState({ error, message: deletedPollWrong }))

  componentDidMount() {
    this.loadUserPolls();
  }

  render() {
    const { userPolls, isLoaded, message } = this.state;

    if (!isLoaded) return null;

    if (!userPolls) return <Messages message={noMyPolls} />;

    return (
      <div>
        <Messages message={message} />
        <PageTitle title={userPollList} />
        <ListGenerator polls={userPolls} deletePoll={this.deletePoll} />
      </div>
    );
  }
}
