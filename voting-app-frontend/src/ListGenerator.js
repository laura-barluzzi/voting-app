import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';

export default class ListGenerator extends Component {

  render() {
    const { polls, deletePoll } = this.props;

    return (
      <div>
        {Object.keys(polls).map((id) =>
          <p key={id}>
            <Link to={{ pathname: `/poll/${id}/${polls[id].creator}`,
                        state: { poll: polls[id] } }}> {polls[id].title} </Link>

            { deletePoll ? <Button onClicked={() => deletePoll(polls[id])} text='&times;' /> : null }
          </p>
        )}
      </div>
    );
  }
}
