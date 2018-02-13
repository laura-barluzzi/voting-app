import request from 'request-promise';

export const requestAllPolls = () => {
  return request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/polls`,
    json: true
  });
};

export const requestUserPolls = (userEmail) => {
  return request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/${userEmail}/polls`,
    json: true
  });
};

export const requestOnePoll = (pollId, pollCreator) => {
  return request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/polls/${pollId}/${pollCreator}`,
    json: true
  });
};

export const requestUpdateVote = (poll, option) => {
  return  request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/vote/${poll.creator}/${poll.id}/${option}`,
    json: true,
    method: 'POST',
    body: {},
  });
};

export const requestNewOrUpdatePoll = (poll, method, token) => {
  return   request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/polls`,
    json: true,
    method,
    body: { poll },
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
};

export const requestDeletePoll = (pollId, email, token) => {
  return  request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/polls/${pollId}/${email}`,
    json: true,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
};