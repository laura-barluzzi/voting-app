import React, { Component } from 'react';
import request from 'request-promise';

export default class PollCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollId: null,
      error: null,
      options: ['Option 1', 'Option 2'],
    };
  }


  addOption = () => {
    const { options } = this.state;

    const newOption = `Option ${options.length + 1}`;
    
    this.setState({ options: options.concat([newOption]) });
  }

  saveForm = () => {
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
      this.setState({ pollId: response.id });
    }).catch(error => {
      this.setState({ error });
    });
  }

  render() {
    const { error, pollId, options } = this.state;

    return (
      <div>
        {error ? <p>{JSON.stringify(error)}</p> : null}
        {pollId ? <p>Created poll {pollId}</p> : null}

        <p>
          <label htmlFor="title">Title</label>
          <input type="text" ref="title" name="title" />
        </p>

        {options.map((option, i) =>
          <p key={option}>
            <label htmlFor={`option${option}`}>Option {i + 1}</label>
            <input type="text" ref={`option${option}`} name={`option${option}`} />
          </p>
        )}

        <button onClick={this.addOption}>Add option</button>

        <button onClick={this.saveForm}>Save</button>
      </div>
    );
  }
}
