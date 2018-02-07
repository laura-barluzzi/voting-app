import React, { Component } from 'react';
import request from 'request-promise';
import { Link } from 'react-router-dom';

export default class PollViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      poll: null,
      error: null,
    };
  }

  loadPoll = (pollId) => {
    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/polls/${pollId}`,
      json: true
    }).then(response => {
      this.setState({ poll: response.poll });
    }).catch(error => {
      this.setState({ error });
    });
  }

  componentDidMount() {
    const pollId = this.props.match.params.id;
    
    this.loadPoll(pollId);
  }
  
  showEditButton = (poll) => 
    <Link to={{ pathname: `/edit/${poll.id}`, state: { poll } }}>Edit</Link>

  render() {
    const { poll } = this.state;
    
    if (!poll) {
      return null;
    }

    return (
      <div>
        { this.props.email === poll.creator ? this.showEditButton(poll) : null }

        <p>Title: {poll.title}</p>
        <p>Creator: {poll.creator}</p>

        {Object.keys(poll.options).map((optionName) =>
          <p key={optionName}>
            Option {optionName} has {poll.options[optionName]} votes
          </p>
        )}
      </div>
    );
  }
}
