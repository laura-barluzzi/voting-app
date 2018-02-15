import React, { PureComponent } from 'react';

export default class Button extends PureComponent {
  render() {
    const { onClicked, text } = this.props;

    if (!onClicked) return <button> {text} </button>;

    return <button onClick={onClicked}> {text} </button>;
    }
}
