import React, { Component } from 'react';
import { requestNewPoll, requestUpdatePoll } from './Requests';
import { Link } from 'react-router-dom';
import PageTitle from './PageTitle';
import Messages from './Messages';

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
      message: '',
      editingPoll: this.props.location.state && this.props.location.state.poll ? true : false,
      saved: false,
      options
    };

  }

  deleteOption = (i) => {
    const newOptions = this.state.options.slice();
    newOptions.splice(i, 1);
    this.setState({ options: newOptions });
  }

  addOption = () => {
    const { options } = this.state;
    const newOption = `Option ${options.length + 1}`;
    this.setState({ options: options.concat([newOption]) });
  }

  checkPollEntries = () => {
    const { options, editingPoll } = this.state;
    const { location } = this.props;
    const pollTitle = this.refs.title.value;
    const pollOptions = {};
    options.forEach((option) => pollOptions[this.refs[`option${option}`].value] = 0);

    if (Object.keys(pollOptions).length < 2 || pollOptions.hasOwnProperty(''))
      return this.setState({ message: 'Minimum 2 options required'});

    if (!pollTitle) return this.setState({ message: 'Poll title required'});

    const newPoll = JSON.parse(JSON.stringify(location.state ? location.state.poll : {}));
    newPoll.title = pollTitle;
    newPoll.options = pollOptions;
    return  editingPoll ? this.saveChangedPoll(newPoll) : this.saveNewPoll(newPoll);
  }

  saveNewPoll = (newPoll) =>
    requestNewPoll(newPoll, this.props.token).then(response => {
      this.setState({ 
        pollId: response.id,
        pollCreator: response.creator,
        message: '',
        saved: true,
        error: null });
    }).catch(error => {
      this.setState({ error });
    });

  saveChangedPoll = (newPoll) =>
    requestUpdatePoll(newPoll, this.props.token).then(response => {
      this.setState({ 
        pollId: response.id,
        pollCreator: response.creator,
        message: '',
        editingPoll: false,
        saved: true,
        error: null });
    }).catch(error => {
      this.setState({ error });
    });

  render() {
    const { error, pollId, options, pollCreator, message, editingPoll, saved } = this.state;
    const { location } = this.props;

    const pageTitle = editingPoll ? 'Editing your poll' : 'Creating a new poll';
    const title = location && location.state ? location.state.poll.title : '';
    
    if (saved && pollId) {
      return <Link to={`/poll/${pollId}/${pollCreator}`}>See your poll.</Link>;
    }

    return (
      <div>
        <Messages message={message}/>
        { error ? <p>{error.error.error}</p> : null }

        <PageTitle title={pageTitle}/>
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

        <button onClick={this.checkPollEntries}>Save</button>

      </div>
    );
  }
}
