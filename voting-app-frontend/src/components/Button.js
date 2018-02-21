import React, { PureComponent } from 'react';

import BsButton from 'react-bootstrap/lib/Button';
import { btn } from '../domain/messages';

const btnStyles = btn.styles;

const doNothing = () => {};

export default class Button extends PureComponent {
  render() {
    const { onClicked, textKey, disabled } = this.props;
    let bsStyle = "default";
    let bsSize = null;

    if (btn.hasOwnProperty(textKey)) {
      if (textKey === "remove") {
        bsStyle = btnStyles.red;
        bsSize="xsmall";
      }
      if (textKey === "vote") bsStyle = btnStyles.blu;
      if (textKey === "login" || textKey === "logout") bsStyle = btnStyles.ligthBlu;
    }

    return <BsButton 
              onClick={onClicked || doNothing}
              bsStyle={bsStyle}
              bsSize={bsSize}
              disabled={disabled}>
              {btn[textKey]}
           </BsButton>;
    }
}
