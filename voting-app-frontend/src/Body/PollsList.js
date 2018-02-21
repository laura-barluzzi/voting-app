import React, { Component } from 'react';

import { requestAllPolls } from '../backend/Requests';
import { 
  allPollList,
  noPublicPolls,
  fetchingPollsWrong } from '../domain/messages';

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
    .catch(error => this.setState({ error, isLoaded: true, message: fetchingPollsWrong}))

  componentDidMount() { this.loadPolls() }

  render() {
    const { polls, isLoaded, message } = this.state;

    if (!isLoaded) {
      return null;
    }

    if (!polls) {
      return <Messages message={noPublicPolls} alertStyle={"info"} />;
    }

    return (
      <div>
        <Messages message={message} alertStyle={"danger"} />
        <PageTitle title={allPollList} />
        <ListGenerator polls={polls} deletePoll={false}/>
      </div>
    );
  }
}
