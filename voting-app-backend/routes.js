const azure = require('azure-storage');
const entGen = azure.TableUtilities.entityGenerator;
const tableService = azure.createTableService();
const uuid = require('uuid/v4');
const express = require('express');

module.exports = (function() {
  const routes = express.Router();

  routes.get('/polls/:id/:email', (req, res) => {

    const pollId = req.params.id;
    const pollCreator = req.params.email;

    tableService.retrieveEntity('polls', pollCreator, pollId, (error, result, response) => {
      if (error) {
        return res.status(500).json({ error });
      }

      if (!result) {
        return res.status(404).json({ error: `Poll ${pollId} created by ${pollCreator} not found`});
      }

      const poll = JSON.parse(result.poll_json['_']);
      return res.status(200).json({ poll });
    });
});

  routes.get('/:email/polls', (req, res) => {

    const user_email = req.params.email;
    const query = new azure.TableQuery()
                  .select('poll_json')
                  .where('PartitionKey eq ?', user_email);

    tableService.queryEntities('polls', query, null, (error, result, response) => {
      if (error) {
        return res.status(500).json({ error });
      }

      const polls = {};
      result.entries.forEach((row) => {
        const poll = JSON.parse(row.poll_json['_']);
        polls[poll.id] = poll;
      });

      return res.status(200).json({ polls });
    });
  });

  routes.get('/polls', (req, res) => {
    const query = new azure.TableQuery().select(['poll_json']);
    tableService.queryEntities('polls', query, null, (error, result, response) => {
      if (error) {
        return res.status(500).json({ error });
      }

      const polls = {};
      result.entries.forEach((row) => {
        const poll = JSON.parse(row.poll_json['_']);
        polls[poll.id] = poll;
      });

      return res.status(200).json({ polls });
    });
  });

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

    const poll_id = uuid();
    const new_options = {};
    optionsArray.forEach(name => new_options[name] = 0);
    poll.options = new_options;

    poll.creator = req.user.email;
    poll.id = poll_id;

    const entity = {
      PartitionKey: entGen.String(req.user.email),
      RowKey: entGen.String(poll_id),
      poll_json: entGen.String(JSON.stringify(poll)),
    };

    tableService.insertEntity('polls', entity, (error) => {
      if (error) {
        return res.status(500).json({ error });
      }

      res.status(201).json({ id: poll_id });
    });
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