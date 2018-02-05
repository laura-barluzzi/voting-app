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
tableService.createTableIfNotExists('polls', (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});
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

app.get('/api/foo', (req, res) => {
  res.json({});
});

app.post('/api/authorized/polls', (req, res) => {
  const poll = req.body.poll;
  if (!poll) {
    return res.status(400).json({error: 'No poll provided'});
  }

  const poll_id = uuid();
  const user_id = req.user.email;

  const entity = {
    PartitionKey: entGen.String(user_id),
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

app.listen(process.env.PORT);
