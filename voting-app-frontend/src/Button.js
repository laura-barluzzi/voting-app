import React, { PureComponent } from 'react';

const doNothing = () => {};

export default class Button extends PureComponent {
  render() {
    const { onClicked, text } = this.props;
    return <button onClick={onClicked || doNothing}> {text} </button>;
    }
}
