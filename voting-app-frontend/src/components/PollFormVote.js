import React, { PureComponent } from 'react';

import Button from './Button';
import PageTitle from './PageTitle';

export default class PollFormVote extends PureComponent {
  render() {
    const { poll, addVote } = this.props;
    return (
      <div>
        <PageTitle text={poll.title} />
        <p><em>Created by {poll.creator}</em></p>
         {Object.keys(poll.options).map((optionName, i) =>
          <p key={optionName}>
            {i}. {optionName}
            <Button onClicked={() => addVote(optionName)} text='Vote' />
          </p>
         )}
      </div>
    );
  }
}
