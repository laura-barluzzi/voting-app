import React, { Component } from 'react';

import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

import {
  changeOption,
  deleteOptionByIndex,
  validateTitle,
  validateOption } from '../domain/domain';

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

  handleChangeTitle = (e) => this.setState({
    title: e.target.value,
    shouldValidate: true
  });

  handleChangeOption = (e, i) => {
    const newOptions = changeOption(this.state.options, i, e.target.value);
    this.setState({ options: newOptions, shouldValidate: true });
  };

  deleteOption = (i) => {
    const newOptions = deleteOptionByIndex(this.state.options, i);
    this.setState({ options: newOptions });
  }

  addOption = () => this.setState({ options: this.state.options.concat([""]) });

  submitForm = (event) => {
    event.preventDefault();
    const { onSubmitForm } = this.props;
    onSubmitForm(this.state.title, this.state.options);
  }

  render() {
    const { title, options, shouldValidate } = this.state;

    const isTitleValid = validateTitle(title);
    const areOptionsValid = options.map(validateOption);
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
