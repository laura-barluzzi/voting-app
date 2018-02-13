const express = require('express');
const {
  fetchPoll, fetchUserPolls, fetchAllPolls,
  createOrUpdatePoll, deletePoll, addVote,
} = require('./db');

const routes = express.Router();

routes.get('/polls/:id/:email', (req, res) =>
  fetchPoll(req.params.email, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error))
);

routes.get('/:email/polls', (req, res) =>
  fetchUserPolls(req.params.email)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error))
);

routes.get('/polls', (req, res) => 
  fetchAllPolls()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error))
);

routes.post('/authorized/polls', (req, res) => {
  const poll = req.body.poll;
  const optionsArray = Object.keys(poll.options);

  if (!poll) {
    return res.status(400).json({error: 'No poll provided'});
  }
  if (!poll.options || poll.options.length < 2 || optionsArray.some(option => !option)) {
    return res.status(400).json({error: 'Minimum 2 options required'});
  }
  if (!poll.title) {
    return res.status(400).json({error: 'Poll title required'});
  }

  createOrUpdatePoll(poll, req.user.email)
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(500).json(error));
});

routes.post('/vote/:email/:id/:option', (req, res) =>
  addVote(req.params.email, req.params.id, req.params.option)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error))
);

routes.patch('/authorized/polls', (req, res) => {
  const poll = req.body.poll;
  const optionsArray = Object.keys(poll.options);

  if (!poll || !poll.id) {
    return res.status(400).json({error: 'No existing poll provided'});
  }

  if (!poll.options || poll.options.length < 2 || optionsArray.some(option => !option)) {
    return res.status(400).json({error: 'Minimum 2 options required'});
  }

  if (!poll.title) {
    return res.status(400).json({error: 'Poll title required'});
  }

  if (poll.creator !== req.user.email) { return res.status(403) }

  createOrUpdatePoll(poll, req.user.email)
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(500).json(error));
});

routes.delete('/authorized/polls/:id/:email', (req, res) => {
  const pollCreator = req.params.email;

  if (pollCreator !== req.user.email) { return res.status(403) }

  deletePoll(req.params.id, pollCreator)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error));
});


module.exports = routes;
