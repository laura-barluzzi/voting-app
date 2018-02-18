import React, { PureComponent } from 'react';

import BsButton from 'react-bootstrap/lib/Button';
const doNothing = () => {};

export default class Button extends PureComponent {
  render() {
    const { onClicked, text } = this.props;
    return <BsButton onClick={onClicked || doNothing}> {text} </BsButton>;
    }
}
