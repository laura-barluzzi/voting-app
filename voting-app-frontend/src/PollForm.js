import React, { Component } from 'react';

import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

import Button from './Button';

export default class PollForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      options: props.options.slice(),
      shouldValidate: false
    };
  }

  getValidationState = (value) =>
    this.state.shouldValidate && value.length > 0;

  handleChangeTitle = (e) => this.setState({
    title: e.target.value,
    shouldValidate: true
  });

  handleChangeOption = (e, i) => {
    const newOptions = this.state.options.slice();
    newOptions[i] = e.target.value;
    this.setState({ options: newOptions, shouldValidate: true });
  };

  deleteOption = (i) => {
    const newOptions = this.state.options.slice();
    newOptions.splice(i, 1);
    this.setState({ options: newOptions });
  }

  addOption = () => {
    const { options } = this.state;
    this.setState({ options: options.concat([""]) });
  }

  submitForm = (event) => {
    event.preventDefault();
    const { onSubmitForm } = this.props;
    onSubmitForm(this.state.title, this.state.options);
  }

  render() {
    const { title, options, shouldValidate } = this.state;

    const isTitleValid = this.getValidationState(title);
    const areOptionsValid = options.map(this.getValidationState);
    const canSubmitForm = isTitleValid && areOptionsValid.every(isValid => isValid);

    return (
      <Form horizontal >
        <FormGroup
          controlId="title"
          bsSize="large"
          validationState={isTitleValid || !shouldValidate ? null : 'error'}
          >
          <Col componentClass={ControlLabel} sm={2}>
            Title
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              placeholder="Title"
              value={title}
              onChange={this.handleChangeTitle}
            />
          </Col>
        </FormGroup>

        {options.map((option, i) =>
          <FormGroup
            key={i}
            controlId={`option${option}`}
            validationState={areOptionsValid[i] || !shouldValidate ? null : 'error'}
            >
            <Col componentClass={ControlLabel} sm={2}>{ i+1 }</Col>
            <Col sm={8}>
              <FormControl
                type="text"
                placeholder={`option ${i+1}`}
                value={option}
                onChange={(e) => this.handleChangeOption(e, i)}
              />
            </Col>
            <Col sm={2}>
              {i >= 2 ? <Button onClicked={() => this.deleteOption(i)} text='&times;' /> : null}
            </Col>
          </FormGroup>
        )}

        <FormGroup>
          <Col sm={6}>
            <Button onClicked={this.addOption} text='Add option' />
          </Col>
          <Col sm={6}>
            <Button onClicked={this.submitForm} text='Save' disabled={!canSubmitForm} />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
