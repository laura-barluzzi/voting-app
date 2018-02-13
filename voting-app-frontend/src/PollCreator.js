import React, { Component } from 'react';
import { requestNewOrUpdatePoll } from './Requests';
import { Link } from 'react-router-dom';

export default class PollCreator extends Component {
  constructor(props) {
    super(props);
    
    const { location } = this.props;
    const startOptions = ['Option 1', 'Option 2'];
    const options =  location.state ? Object.keys(location.state.poll.options) : startOptions;

    this.state = {
      pollId: null,
      pollCreator: null,
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
  
  savePoll = () => {
    const { token, location } = this.props;
    const { options } = this.state;

    const pollTitle = this.refs.title.value;
    const pollOptions = {};
    options.forEach((option) => pollOptions[this.refs[`option${option}`].value] = 0);

    const newPoll = JSON.parse(JSON.stringify(location.state ? location.state.poll : {}));
    newPoll.title = pollTitle;
    newPoll.options = pollOptions;

    const method = location.state ? 'PATCH' : 'POST';

    requestNewOrUpdatePoll(newPoll, method, token).then(response => {
      this.setState({ pollId: response.id, pollCreator: response.creator, error: null });
    }).catch(error => {
      this.setState({ error });
    });
  }

  render() {
    const { error, pollId, options, pollCreator } = this.state;
    const { location } = this.props;

    const title = location && location.state ? location.state.poll.title : '';

    return (
      <div>
        {error ? <p>{error.error.error}</p> : null}
        {pollId ? <p><Link to={`/poll/${pollId}/${pollCreator}`}>See your poll.</Link></p> : null}

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
