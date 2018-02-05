import React, { PureComponent } from 'react';
import PollsViewer from './PollsViewer';
import { Link } from 'react-router-dom';

export default class Main extends PureComponent {
  render() {
    return (
      <div>
        <Link to="/create">Create poll</Link>
        <hr/>
        <PollsViewer />
      </div>
    );
  }
}
