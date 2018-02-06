require('dotenv').config();

const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const azure = require('azure-storage');
const passport = require('passport');
const AD = require('passport-azure-ad');
const express = require('express');
const cors = require('cors');

const entGen = azure.TableUtilities.entityGenerator;
const tableService = azure.createTableService();
const app = express();

const AdClient = 'e5fb9cfa-5e1a-4f3a-8b07-1828c1b64ba5';

const adOptions = {
  identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
  clientID: AdClient,
  validateIssuer: false,
  issuer: null,
  passReqToCallback: true,
  allowMultiAudiencesInToken: false,
  loggingLevel: 'info'
};

const bearerStrategy = new AD.BearerStrategy(adOptions, (req, token, done) => {
  const user = { email: token.preferred_username };
  done(null, user, token);
});

app.use(cors({ origin: true, credentials: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(bearerStrategy);
app.use('/api/authorized', passport.authenticate('oauth-bearer', { session: false }));
app.use(bodyParser.json());

app.get('/api/polls/:id', (req, res) => {

  const poll_id = req.params.id;
  const query = new azure.TableQuery().select('poll_json').where('RowKey eq ?', poll_id);

  tableService.queryEntities('polls', query, null, (error, result, response) => {
    if (error) {
      return res.status(500).json({ error });
    }
    if (!result.entries || result.entries.length === 0) {
      return res.status(404).json({ error: `Poll ${poll_id} not found`})
    }

    const poll = JSON.parse(result.entries[0].poll_json['_']);
    return res.status(200).json({ poll });
  });
});

app.get('/api/:email/polls', (req, res) => {

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

app.get('/api/polls', (req, res) => {
  const query = new azure.TableQuery().select(['poll_json']);
  tableService.queryEntities('polls', query, null, (error, result, response) => {
    if (error) {
      return res.status(500).json({ error });
    }

    const polls = {};
    result.entries.forEach((row) => {
      const poll = JSON.parse(row.poll_json['_']);
      polls[poll.id] = poll.title;
    });

    return res.status(200).json({ polls });
  });
});

app.post('/api/authorized/polls', (req, res) => {
  const poll = req.body.poll;
  if (!poll) {
    return res.status(400).json({error: 'No poll provided'});
  }
  if (!poll.options || poll.options.length < 2 || poll.options.some(option => !option)) {
    return res.status(400).json({error: 'Minimum 2 options required'});
  }
  if (!poll.title) {
    return res.status(400).json({error: 'Poll title required'});
  }
  
  const poll_id = uuid();

  const new_options = {};
  poll.options.forEach(name => new_options[name] = 0);
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

tableService.createTableIfNotExists('polls', (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    app.listen(process.env.PORT);
  }
});
