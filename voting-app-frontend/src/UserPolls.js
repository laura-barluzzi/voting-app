import React, { PureComponent } from 'react';

import { requestDeletePoll, requestUserPolls } from './Requests';
import ListGenerator from './ListGenerator';
import PageTitle from './PageTitle';
import Messages from './Messages';

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
    .catch(error => this.setState({ error, isLoaded: true }))

  deletePoll = (poll) => requestDeletePoll(poll, this.props.token)
    .then(response => {
      if (response.deleted) {
        const newPolls = Object.assign({}, this.state.userPolls);
        delete newPolls[poll.id];
        this.setState({ userPolls: newPolls, message: `Poll ${poll.title} deleted.` });
      }
    })
    .catch(error => this.setState({ error }))

  componentDidMount() {
    this.loadUserPolls();
  }

  render() {
    const { userPolls, isLoaded, message } = this.state;

    if (!isLoaded) return null;

    if (!userPolls) return <Messages message={'You do not have polls yet'}  alertStyle={"warning"} />;

    return (
      <div>
        <PageTitle title={'My polls'}/>
        <Messages message={message} alertStyle={"success"} />
        <ListGenerator polls={userPolls} deletePoll={this.deletePoll}/>
      </div>
    );
  }
}
