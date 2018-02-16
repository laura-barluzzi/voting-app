import React, { Component } from 'react';
import { Bar, BarChart, Legend, XAxis, YAxis } from 'recharts';

const getTotalOfVotes = (pollVotes, tot=0) => {
  pollVotes.forEach((vote) => tot += vote);
  return tot;
};


class CustomizedLabel extends Component {
  render () {
    const {x, y, width, fill, value} = this.props;
   	return <text 
               x={x + width / 2}
               y={y}
               dy={-4}
               fontSize='16' 
               fontFamily='sans-serif'
               fill={fill}
               textAnchor="middle">{value}%</text>;
  }
}

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
        <Bar dataKey="percent" fill="#82ca9d" label={<CustomizedLabel />} />
      </BarChart>
    );
  }
}