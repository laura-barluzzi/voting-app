import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import { requestDeletePoll, requestUserPolls } from './Requests';


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

  loadUserPolls = () => requestUserPolls(this.props.email, this.props.token).then(response => {
      this.setState({ userPolls: response.polls, isLoaded: true });
    }).catch(error => {
      this.setState({ error, isLoaded: true });
    });

  deletePoll = (poll) => {
    const { token } = this.props;
    const { userPolls } = this.state;

    requestDeletePoll(poll, token).then(response => {
      if (response.deleted) {
        const deletedPoll = userPolls[poll.id];
        const newPolls = Object.assign({}, userPolls);
        delete newPolls[poll.id];
        this.setState({ userPolls: newPolls, message: `Poll ${deletedPoll.title} deleted.` });
      }
    }).catch(error => {
      this.setState({ error });
    });
  }

  componentDidMount() {
    this.loadUserPolls();
  }
 
  render() {
    const { userPolls, isLoaded, message } = this.state;

    if (!isLoaded) {
      return null;
    }

    if (!userPolls) {
      return (
        <div>
          <p>You don't have any poll yet</p>
          <Link to="/create">Create your first poll!</Link>
        </div>
      );
    }

    return (
      <div>
        <h3> My polls </h3>
        { message ? message : null }
        {Object.keys(userPolls).map((pollId) =>
          <p key={pollId}>
            <Link to={`/poll/${pollId}/${userPolls[pollId].creator}`}>{userPolls[pollId].title}</Link>
            <button onClick={() => this.deletePoll(userPolls[pollId])}>&times;</button>
          </p>
        )}
      </div>
    );
  }
}
