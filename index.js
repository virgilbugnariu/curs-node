const http = require('http');
const express = require('express');
const storageDriver = require('./storage');

const app = express(http);
app.use(express.json());

const storage = new storageDriver();

app.get('/:id?', (req, res) => {
    const entryId = req.params.id;
    const response = JSON.stringify(storage.read(entryId));
    res.send(response);
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
