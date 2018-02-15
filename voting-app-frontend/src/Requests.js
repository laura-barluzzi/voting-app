import request from 'request-promise';

export const requestAllPolls = () => {
  return  request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/polls`,
    json: true
  });
};

export const requestUserPolls = (userEmail, token) => {
  return  request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/polls/${userEmail}`,
    json: true,
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
};

export const requestOnePoll = (pollId, pollCreator) => {
  return  request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/polls/${pollCreator}/${pollId}`,
    json: true
  });
};

export const requestUpdateVote = (poll, option) => {
  return  request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/polls/${poll.creator}/${poll.id}/vote`,
    json: true,
    method: 'POST',
    body: { option },
  });
};

export const requestNewPoll = (poll, token) => {
  return  request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/polls`,
    json: true,
    method: 'POST',
    body: { poll },
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
};

export const requestUpdatePoll = (poll, token) => {
  return request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/polls/${poll.creator}/${poll.id}`,
    json: true,
    method: 'PATCH',
    body: { poll },
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
};

export const requestDeletePoll = (poll, token) => {
  return  request({
    uri: `${process.env.REACT_APP_SERVER_HOST}/api/authorized/polls/${poll.creator}/${poll.id}`,
    json: true,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
};