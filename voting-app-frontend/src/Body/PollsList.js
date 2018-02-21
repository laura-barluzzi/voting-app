import React, { Component } from 'react';

import { requestAllPolls } from '../backend/Requests';

import ListGenerator from '../components/ListGenerator';
import Messages from '../components/Messages';
import PageTitle from '../components/PageTitle';

export default class PollsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      polls: null,
      error: null,
      isLoaded: false,
    };
  }

  loadPolls = () => requestAllPolls()
    .then(response => this.setState({ polls: response.polls, isLoaded: true }))
    .catch(error => this.setState({ error, isLoaded: true }))

  componentDidMount() { this.loadPolls() }

  render() {
    const { polls, isLoaded } = this.state;

    if (!isLoaded) {
      return null;
    }

    if (!polls) {
      return <Messages message={'There are not polls yet :('} alertStyle={"info"} />;
    }

    return (
      <div>
        <PageTitle title={'Vote in any of these polls!'} />
        <ListGenerator polls={polls} deletePoll={false}/>
      </div>
    );
  }
}
