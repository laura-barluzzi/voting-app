import React, { Component } from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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
    return (tot) ? data: null;
  }

  render() {
    const data = this.getData(this.props.poll.options);

    if (!data) return null;

    return (
      <div style={{width: "90%"}}>
        <ResponsiveContainer minWidth={300} height={300} >
          <BarChart data={data}
                    margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Legend />
            <Bar dataKey="percent" fill="#82ca9d" label={<CustomizedLabel />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}