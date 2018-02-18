import React, { PureComponent } from 'react';

const BsButton = require('react-bootstrap').Button;
const doNothing = () => {};

export default class Button extends PureComponent {
  render() {
    const { onClicked, text } = this.props;
    return <BsButton onClick={onClicked || doNothing}> {text} </BsButton>;
    }
}
