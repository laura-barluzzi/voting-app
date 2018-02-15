import React, { Component } from 'react';

export default class PageTitle extends Component {

  render() {
    const { title } = this.props;

    return <h3>{ title }</h3>;
  }
}
