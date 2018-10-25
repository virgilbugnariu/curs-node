const http = require('http');
const express = require('express');
const storageDriver = require('./storage');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');

const app = express(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const storage = new storageDriver();

const admin = {
  username: "admin",
  password: "admin",
}

const secret = "superSecretdiscret";

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === admin.username && password === admin.password) {
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 30,
      username: username,
    }, secret);

    res.status(200).send({
      token: token,
    });
  } else {
    res.status(401).send({
      error: "Nope",
    });
  }
});


app.get('/:id?', (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  jwt.verify(token, secret, function(err, decoded) {
    if(err) {
      console.log('error', err);
      return res.status(401).send({
        error: "unauthorized",
      })
    } else {
      const entryId = req.params.id;
      const response = JSON.stringify(storage.read(entryId));
      return res.send(response);
    }
  });
});

app.post('/', (req, res) => {
    const addedEntry = storage.create(req.body);
    const response = JSON.stringify(addedEntry);

    res.send(response);
});

app.put('/:id', (req, res) => {
  const entryId = req.params.id;
  const body = req.body;

  storage.update(entryId, body);
  res.send(storage.read(entryId));
});

app.delete('/:id', (req, res) => {
  const entryId = req.params.id;
  storage.delete(entryId);
  res.send(`deleting entry with id: ${entryId}`)
});

app.listen(3000, () => console.log('started'));
