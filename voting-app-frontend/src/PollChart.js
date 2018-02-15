import React, { Component } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';


export default class PollChart extends Component {

  generateData = () => {
    const poll = this.props.poll;
    const data = [];
    Object.keys(poll.options).forEach((optionName) => {
      data.push({name: optionName, uv: poll.options[optionName]});
    });
    return data;
  }

  render() {
    return (
      <BarChart width={600} height={300} data={this.generateData()}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Bar dataKey="uv" stackId="a" fill="#82ca9d" onClick={this.props.onBarClicked}/>
      </BarChart>
    );
  }
}