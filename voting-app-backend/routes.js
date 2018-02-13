const azure = require('azure-storage');
const entGen = azure.TableUtilities.entityGenerator;
const tableService = azure.createTableService();
const { fetchPoll, fetchUserPolls, fetchAllPolls, createPoll } = require('./db');
const express = require('express');

module.exports = (function() {
  const routes = express.Router();

  routes.get('/polls/:id/:email', (req, res) => {
    const db_result = fetchPoll(req.params.id, req.params.email);
    const error = db_result.error ? db_result.error : null;
    return error ? res.status(500).json({ error }) : res.status(200).json({ db_result });
});

  routes.get('/:email/polls', (req, res) => {
    const db_result = fetchUserPolls(req.params.email);
    const error = db_result.error ? db_result.error : null;
    return error ? res.status(500).json({ error }) : res.status(200).json({ db_result });
  });

  routes.get('/polls', (req, res) => {
    const db_result = fetchAllPolls();
    const error = db_result.error ? db_result.error : null;
    return error ? res.status(500).json({ error }) : res.status(200).json({ db_result });
  });

  routes.post('/authorized/polls', (req, res) => {
    const poll = req.params.poll;
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

    const db_result = createPoll(poll, req.user.email);
    const error = db_result.error ? db_result.error : null;
    return error ? res.status(500).json({ error }) : res.status(200).json({ db_result }); 
  });

  routes.post('/vote', (req, res) => {
    const poll = req.body.poll;
  
    if (!poll) {
      return res.status(400).json({error: 'No existing poll provided'});
    }

    const entity = {
      PartitionKey: entGen.String(poll.creator),
      RowKey: entGen.String(poll.id),
      poll_json: entGen.String(JSON.stringify(poll)),
    };

    tableService.replaceEntity('polls', entity, (error) => {
      if (error) {
        return res.status(500).json({ error });
      }
    });
    res.status(201).json({ poll });
  });

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

    const entity = {
      PartitionKey: entGen.String(req.user.email),
      RowKey: entGen.String(poll.id),
      poll_json: entGen.String(JSON.stringify(poll)),
    };

    tableService.insertOrReplaceEntity('polls', entity, (error) => {
      if (error) {
        return res.status(500).json({ error });
      }

      res.status(200).json({ id: poll.id });
    });
  });

  routes.delete('/authorized/polls/:id/:email', (req, res) => {

    const pollId = req.params.id;
    const creator = req.params.email;
    const task = { PartitionKey: {'_': creator}, RowKey: {'_': pollId}};
  
    if (creator !== req.user.email) {
      return res.status(403);
    }

    tableService.deleteEntity('polls', task, function(error, response){
      if (error) {
        return res.status(500).json({ error });
      }

      return res.json({ deleted : response.isSuccessful});
    });
  });

  return routes;
})();