import React, { Component } from 'react';
import request from 'request-promise';

export default class Foo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: null,
      error: null,
    }
  }
  
  fetchData = (token) => {
    request({
      uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/foo`,
      json: true,
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(response => {
      this.setState({
        response: response,
      });
    }).catch(error => {
      this.setState({
        error: error,
      });
    });
  }

  componentDidMount() {
    const { token } = this.props;
    if (token) {
      this.fetchData(token);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.token !== nextProps.token) {
      this.fetchData(nextProps.token);
    }
  }

  render() {
    const { response, error } = this.state;

    if (error) {
      return (
        <div>
          Ooops, something went wrong: {JSON.stringify(error)}
        </div>
      );
    }

    if (!response) {
      return null;
    }

    return (
      <div>
        {JSON.stringify(response)}
      </div>
    );
  }
}
