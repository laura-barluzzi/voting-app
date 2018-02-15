const express = require('express');
const uuid = require('uuid/v4');

const {
  fetchPoll, fetchUserPolls, fetchAllPolls,
  createOrUpdatePoll, deletePoll, addVote,
} = require('./db');

const routes = express.Router();


routes.get('/polls', (req, res) => 
  fetchAllPolls()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error))
);

routes.get('/authorized/polls/:email', (req, res) =>
  fetchUserPolls(req.params.email)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error))
);

routes.get('/polls/:email/:id', (req, res) =>
  fetchPoll(req.params.email, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error))
);

routes.post('/polls/:email/:id/vote', (req, res) =>
  addVote(req.params.email, req.params.id, req.body.option)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error))
);

routes.post('/authorized/polls', (req, res) => {
  const poll = req.body.poll;

  poll.creator = req.user.email;
  poll.id = uuid();

  createOrUpdatePoll(poll)
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(500).json(error));
});

routes.patch('/authorized/polls/:email/:id', (req, res) => {
  const poll = req.body.poll;

  if (poll.id !== req.params.id) {
    return res.status(400).json({error: 'Poll not recognized'});
  }

  if (poll.creator !== req.user.email) { return res.status(403) }

  createOrUpdatePoll(poll)
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(500).json(error));
});

routes.delete('/authorized/polls/:email/:id', (req, res) => {
  const pollCreator = req.params.email;

  if (pollCreator !== req.user.email) { return res.status(403) }

  deletePoll(req.params.id, pollCreator)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json(error));
});


module.exports = routes;
