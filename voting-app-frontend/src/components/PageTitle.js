import React, { Component } from 'react';

export default class PageTitle extends Component {

  render() {
    const { title, subTitle } = this.props;

    return(
      <div>
        <h3>{ title }</h3>
        <p><em>{subTitle || null}</em></p> 
      </div>
    );
  }
}
