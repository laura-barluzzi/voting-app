import React, { PureComponent } from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

import Button from './Button';

export default class PollFormVote extends PureComponent {
  render() {
    const { options, addVote } = this.props;
    return (
        <Form horizontal >
        {Object.keys(options).map((option, i) =>
          <FormGroup readOnly key={i} controlId={`option${option}`}>
            <Col componentClass={ControlLabel} sm={2}>{ i+1 }</Col>
            <Col sm={8}>
              <FormControl type="text" value={option} readOnly />
            </Col>
            <Col sm={2}>
              <Button onClicked={() => addVote(option)} textKey="vote" />
            </Col>
          </FormGroup>
        )}
        </Form>
    );
  }
}