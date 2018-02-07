import React, { Component } from 'react';
import request from 'request-promise';
import { Link } from 'react-router-dom';

export default class PollCreator extends Component {
  constructor(props) {
    super(props);
    
    const { location } = this.props;
    const startOptions = ['Option 1', 'Option 2'];
    const options =  location.state ? Object.keys(location.state.poll.options) : startOptions;

    this.state = {
      pollId: null,
      error: null,
      options
    };

  }

  deleteOption = (i) => {
    const { options } = this.state;
    
    const newOptions = options.slice();
    newOptions.splice(i, 1);
    
    this.setState({ options: newOptions });
  }

  addOption = () => {
    const { options } = this.state;

    const newOption = `Option ${options.length + 1}`;
    
    this.setState({ options: options.concat([newOption]) });
  }
  
  editPoll = (state, newTitle, newOptions) => {

    if (!state || !state.poll) {
      return null;
    }

    if (state.poll.title !== newTitle) {
      state.poll.title = newTitle;
    }
    state.poll.options = {};
    newOptions.forEach(function(newOption) {
      state.poll.options[newOption] = 0;
    });
    return state.poll;
  }

  savePoll = () => {
    const { token, location } = this.props;
    const { options } = this.state;

    const pollTitle = this.refs.title.value;
    const pollOptions = options.map(option => this.refs[`option${option}`].value);

    const newPoll = { title: pollTitle, options: pollOptions };
    const editedPoll = this.editPoll(location.state, pollTitle, pollOptions);

    const poll = editedPoll ? editedPoll : newPoll;
    const method = location.state ? 'PATCH' : 'POST';

    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/polls`,
      json: true,
      method: method,
      body: { poll },
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(response => {
      this.setState({ pollId: response.id, error: null });
    }).catch(error => {
      this.setState({ error });
    });
  }

  render() {
    const { error, pollId, options } = this.state;
    const { location } = this.props;

    const title = location && location.state ? location.state.poll.title : '';

    return (
      <div>
        {error ? <p>{error.error.error}</p> : null}
        {pollId ? <p><Link to={`/poll/${pollId}`}>See your poll.</Link></p> : null}

        <p>
          <label htmlFor="title">Title</label>
          <input type="text" ref="title" name="title" defaultValue={title} />
        </p>

        {options.map((option, i) =>
          <p key={option}>
            <label htmlFor={`option${option}`}>Option {i + 1}</label>
            <input type="text" ref={`option${option}`} name={`option${option}`} defaultValue={option}/>
            {i >= 2 ? <button onClick={() => this.deleteOption(i)}>&times;</button> : null}
          </p>
        )}

        <button onClick={this.addOption}>Add option</button>

        <button onClick={this.savePoll}>Save</button>
      </div>
    );
  }
}
