import React, { Component } from 'react';
import { Bar, BarChart, Legend, XAxis, YAxis } from 'recharts';

export default class PollChart extends Component {

  generateData = () => {
    const options = this.props.poll.options;
    const data = [];
    Object.keys(options).forEach((name) =>
      data.push({name: name, percent: options[name]}));
    return data;
  }

  render() {
    return (
      <BarChart className="white-bg" width={600} height={300} fill="white" data={this.generateData()}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Legend />
        <Bar dataKey="percent" fill="#82ca9d" />
      </BarChart>
    );
  }
}