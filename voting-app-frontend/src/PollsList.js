import React, { Component } from 'react';
import { requestAllPolls } from './Requests';
import ListGenerator from './ListGenerator';

export default class PollsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      polls: null,
      error: null,
      isLoaded: false,
    };
  }

  loadPolls = () => requestAllPolls().then(response => {
      this.setState({ polls: response.polls, isLoaded: true });
    }).catch(error => {
      this.setState({ error, isLoaded: true });
    });

  componentDidMount() {
    this.loadPolls();
  }

  render() {
    const { polls, isLoaded } = this.state;

    if (!isLoaded) {
      return null;
    }

    if (!polls) {
      return <p>No polls yet :(</p>;
    }

    return <ListGenerator polls={polls} deletePoll={false}/>;
  }
}
