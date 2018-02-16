import React, { Component } from 'react';
import { Bar, BarChart, Legend, XAxis, YAxis } from 'recharts';

const getTotalOfVotes = (pollVotes, tot=0) => {
  pollVotes.forEach((vote) => tot += vote);
  return tot;
};

export default class PollChart extends Component {

  getData = (options, data=[]) => {
    const tot = getTotalOfVotes(Object.values(options));
    Object.keys(options).forEach((name) =>
      data.push({ 
        name: name,
        percent: Math.round((options[name] / tot) * 100)
      }));
    return data;
  }

  render() {
    return (
      <BarChart width={600} height={300} data={this.getData(this.props.poll.options)}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Legend />
        <Bar dataKey="percent" fill="#82ca9d" />
      </BarChart>
    );
  }
}