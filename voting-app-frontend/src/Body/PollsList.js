import React, { Component } from 'react';

import { requestAllPolls } from '../backend/Requests';
import { noPublicPolls, titlePages, failure } from '../domain/messages';

import ListGenerator from '../components/ListGenerator';
import Messages from '../components/Messages';
import PageTitle from '../components/PageTitle';

export default class PollsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      polls: null,
      error: null,
      message: '',
      isLoaded: false,
    };
  }

  loadPolls = () => requestAllPolls()
    .then(response => this.setState({ polls: response.polls, isLoaded: true }))
    .catch(error => this.setState({ error, isLoaded: true, message: failure.fetchingPolls}))

  componentDidMount() { this.loadPolls() }

  render() {
    const { polls, isLoaded, message, error } = this.state;
    const msgStyle = error ? 'danger' : 'success';

    if (!isLoaded) return null;

    if (!polls) return <Messages message={noPublicPolls} alertStyle={'warning'} />;

    return (
      <div>
        <Messages message={message} alertStyle={msgStyle} />
        <PageTitle title={titlePages.pollsList} />
        <ListGenerator polls={polls} deletePoll={false} />
      </div>
    );
  }
}
