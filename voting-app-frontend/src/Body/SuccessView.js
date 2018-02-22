import React, { PureComponent } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';

import { success } from '../domain/messages';

import Button from 'react-bootstrap/lib/Button';
import Messages from '../components/Messages';
import PageTitle from '../components/PageTitle';

const host = window.location.origin + '/#';

export default class SuccessView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { host,  copied: false  };
  }

  onCopy = () =>  this.setState({copied: true})

  render() {
    const { copied } = this.state;
    const { id, creator, alertStyle } = this.props;
    const message = copied ? success.clipboard : this.props.message;
    const pollUrl = `/poll/${id}/${creator}`;

    return (
      <div>
        <Messages message={message} alertStyle={alertStyle} />
        <PageTitle text={success.saving} />
        <Link to={pollUrl}>See your poll.</Link>
        <p>or</p>
        <CopyToClipboard onCopy={this.onCopy} text={this.state.host + pollUrl}>
          <Button>Copy to clipboard</Button>
        </CopyToClipboard>
      </div>
    );
    }
}
