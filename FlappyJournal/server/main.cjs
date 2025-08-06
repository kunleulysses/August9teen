const express = require('express');
const SigilIdentity = require('./sigil-identity.cjs');
const SigilBasedCodeAuthenticator = require('./consciousness/sigil-based-code-authenticator.cjs');

const app = express();
const port = process.env.PORT || 3001;

const sigilAuthenticator = new SigilBasedCodeAuthenticator();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

sigilAuthenticator.preload().then(() => {
  sigilAuthenticator.sigilIdentity.start().then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  });
});

process.on('SIGINT', () => {
  sigilAuthenticator.sigilIdentity.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  sigilAuthenticator.sigilIdentity.stop();
  process.exit(0);
});