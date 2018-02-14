const Promise = require('promise');
const azure = require('azure-storage');
const tableService = azure.createTableService();
const entGen = azure.TableUtilities.entityGenerator;


const createOrUpdatePoll = (poll) => {
  const entity = {
    PartitionKey: entGen.String(poll.creator),
    RowKey: entGen.String(poll.id),
    poll_json: entGen.String(JSON.stringify(poll)),
  };

  return new Promise((resolve, reject) => {
    tableService.insertOrReplaceEntity('polls', entity, (error) => {
      if (error) return reject({ error });
      return resolve(poll);
    });
  });
};

const addVote = (pollCreator, pollId, option) => {
  return new Promise((resolve, reject) => {
    fetchPoll(pollCreator, pollId)
      .then(poll => {
        poll.options[option]++;
      
        const entity = {
          PartitionKey: entGen.String(poll.creator),
          RowKey: entGen.String(poll.id),
          poll_json: entGen.String(JSON.stringify(poll)),
        };

        tableService.replaceEntity('polls', entity, (error) => {
          if (error) return reject({ error });
          return resolve(poll);
        });
      })
      .catch(reject);
  });
};

const fetchPoll = (pollCreator, pollId) => {
  return new Promise((resolve, reject) => {
    tableService.retrieveEntity('polls', pollCreator, pollId, (error, result, response) => {
      if (error) return reject({ error });

      if (!result) {
        return reject({ error: `Poll ${pollId} created by ${pollCreator} not found`});
      }

      return resolve(JSON.parse(result.poll_json['_']));
    });
  });
};

const deletePoll = (pollId, pollCreator) => {
  const task = { PartitionKey: {'_': pollCreator}, RowKey: {'_': pollId}};
  return new Promise((resolve, reject) => {
    tableService.deleteEntity('polls', task, (error, response) => {
      if (error) return reject({ error });
      return resolve({ deleted : response.isSuccessful });
    });
  });
};

const fetchUserPolls = (userEmail) => {
  const query = new azure.TableQuery()
                .select('poll_json')
                .where('PartitionKey eq ?', userEmail);

  return new Promise((resolve, reject) => {
    tableService.queryEntities('polls', query, null, (error, result, response) => {
      if (error) return reject({ error });

      const polls = {};
      result.entries.forEach((row) => {
        const poll = JSON.parse(row.poll_json['_']);
        polls[poll.id] = poll;
      });

      return resolve({ polls });
    });
  });
};

const fetchAllPolls = () => {
  const query = new azure.TableQuery().select(['poll_json']);

  return new Promise((resolve, reject) => {
    tableService.queryEntities('polls', query, null, (error, result, response) => {
      if (error) return reject({ error });

      const polls = {};
      result.entries.forEach((row) => {
        const poll = JSON.parse(row.poll_json['_']);
        polls[poll.id] = poll;
      });

      return resolve({ polls });
    });
  });

};

const createTable = (app) => {
  return new Promise((resolve, reject) => {
    tableService.createTableIfNotExists('polls', (error) => {
      if (error) {
        console.error(error);
        process.exit(1);
        reject();
      } else {
        app.listen(process.env.PORT);
        resolve();
      }
    });
  });

};

module.exports = {
  fetchPoll, fetchUserPolls, fetchAllPolls, createOrUpdatePoll,
  deletePoll, createTable, addVote,
};