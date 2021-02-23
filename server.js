const express = require('express');

const app = express();

const PORT = 5000;

const bodyParser = require('body-parser');

const path = require('path');

const axios = require('axios');

const CLIENT_ID = "Your API Key";
const CLIENT_Secret = "Your API Secret";


app.use(bodyParser.json({extended: true}), express.json());

app.post('/token', (req, res) => {
  console.log(req.body);
  console.log(req.headers.authorization);
  console.log(req.headers['content-type']);
  console.log(req.headers.accept);
  console.log(req.query.grant_type);
  console.log(req.query.redirect_uri);
  console.log(req.query.code);
  axios
    .post(
      'https://identity.fortellis.io/oauth2/aus1p1ixy7YL8cMq02p7/v1/token/?grant_type=' +
        req.query.grant_type +
        '&redirect_uri=' +
        req.query.redirect_uri +
        '&code=' +
        req.query.code,
      null,
      {
        headers: {
          accept: 'application/json',
          authorization:
            `Basic ${token}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
      }
    )
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

app.use(express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build'));
});
