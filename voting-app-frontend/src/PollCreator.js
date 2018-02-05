import React, { Component } from 'react';
import request from 'request-promise';
import { Link } from 'react-router-dom';

export default class PollCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollId: null,
      error: null,
      options: ['Option 1', 'Option 2'],
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

  savePoll = () => {
    const { token } = this.props;
    const { options } = this.state;

    const pollTitle = this.refs.title.value;
    const pollOptions = options.map(option => this.refs[`option${option}`].value);

    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/polls`,
      json: true,
      method: 'POST',
      body: {
        poll: {
          title: pollTitle,
          options: pollOptions,
        }
      },
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

    return (
      <div>
        {error ? <p>{error.error.error}</p> : null}
        {pollId ? <p><Link to={`/poll/${pollId}`}>Created poll.</Link></p> : null}

        <p>
          <label htmlFor="title">Title</label>
          <input type="text" ref="title" name="title" />
        </p>

        {options.map((option, i) =>
          <p key={option}>
            <label htmlFor={`option${option}`}>Option {i + 1}</label>
            <input type="text" ref={`option${option}`} name={`option${option}`} />
            {i >= 2 ? <button onClick={() => this.deleteOption(i)}>&times;</button> : null}
          </p>
        )}

        <button onClick={this.addOption}>Add option</button>

        <button onClick={this.savePoll}>Save</button>
      </div>
    );
  }
}
