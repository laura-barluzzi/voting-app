require('dotenv').config();

const bodyParser = require('body-parser');
const passport = require('passport');
const AD = require('passport-azure-ad');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const { createTable } = require('./db');
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

app.use('/api', routes);

createTable()
  .then(app.listen(process.env.PORT))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });