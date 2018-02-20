import React, { PureComponent } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';

import Button from './Button';
import Messages from './Messages';
import PageTitle from './PageTitle';

const host = window.location.origin + '/#';

export default class SuccessView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { host,  saved: false  };
  }

  onCopy = () =>  this.setState({copied: true})

  render() {
    const { id, creator, message } = this.props;
    const pollUrl = `/poll/${id}/${creator}`;
    return (
      <div>
        <Messages message={message} alertStyle={"success"} />
        <PageTitle text="Poll successfully saved :)" />
        <Link to={pollUrl}>See your poll.</Link>
        <p>or</p>
        <CopyToClipboard onCopy={this.onCopy} text={this.state.host + pollUrl}>
          <Button text='copy to clipboard' />
        </CopyToClipboard>
      </div>
    );
    }
}
