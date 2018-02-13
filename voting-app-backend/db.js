const azure = require('azure-storage');
const entGen = azure.TableUtilities.entityGenerator;
const tableService = azure.createTableService();
const uuid = require('uuid/v4');

export const createPoll = (poll, pollCreator) => {
  const new_options = {};
  Object.keys(poll.options).forEach(name => new_options[name] = 0);
  poll.options = new_options;

  poll.creator = pollCreator;
  poll.id = uuid();

  const entity = {
    PartitionKey: entGen.String(pollCreator),
    RowKey: entGen.String(poll.id),
    poll_json: entGen.String(JSON.stringify(poll)),
  };

  tableService.insertEntity('polls', entity, (error) => {
    if (error) { return { error } }
    return { id: poll.id };
  });
};

export const fetchPoll = (pollCreator, pollId) => {
  tableService.retrieveEntity('polls', pollCreator, pollId, (error, result, response) => {
    if (error) { return { error } } // res.status(500).json({ error });

    if (!result) {
      return { error: `Poll ${pollId} created by ${pollCreator} not found`}; //res.status(404).json({ error: `Poll ${pollId} created by ${pollCreator} not found`});
    }

    return JSON.parse(result.poll_json['_']); //res.status(200).json({ poll });
  });
};

export const deletePoll = () => {};

export const fetchUserPolls = (userEmail) => {
  const query = new azure.TableQuery()
                .select('poll_json')
                .where('PartitionKey eq ?', userEmail);

  tableService.queryEntities('polls', query, null, (error, result, response) => {
    if (error) { return { error } }

    const polls = {};
    result.entries.forEach((row) => {
      const poll = JSON.parse(row.poll_json['_']);
      polls[poll.id] = poll;
    });

    return { polls };
  });
};

export const fetchAllPolls = () => {
  const query = new azure.TableQuery().select(['poll_json']);
  tableService.queryEntities('polls', query, null, (error, result, response) => {
    if (error) { return { error } }

    const polls = {};
    result.entries.forEach((row) => {
      const poll = JSON.parse(row.poll_json['_']);
      polls[poll.id] = poll;
    });

    return { polls };
  });
};
