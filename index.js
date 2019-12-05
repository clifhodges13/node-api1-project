// implement your API here
const express = require('express');
const db = require("./data/db");

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the api')
  console.log({ "ip": req.ip})
})

// POST A USER
app.post('/api/users', (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
  } else {
    db.insert(req.body)
      .then(newUser => res.json(newUser))
      .catch(err => res.status(500).json({errorMessage: "There was an error while saving the user to the database."}))
  }
})

// GET ALL USERS
app.get('/api/users', (req, res) => {
  db.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ message: "The users information could not be retrieved." }))
})

// GET ONE USER BY ID
app.get('/api/users/:id', (req, res) => {
  db.findById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(404).json({ message: "The user with the specified ID does not exist." }))
})

// PUT A USER, (EDIT)
app.put('/api/users/:id', (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
  } else if (!req.params.id) {
    res.status(404).json({errorMessage: "The user with the specified ID does not exist." })
  } else {
    db.update(req.params.id, req.body)
      .then(user => res.status(200).json({ numberOfUsersUpdated: user, message: `User ID: ${req.params.id} updated successfully.`}))
      .catch(err => res.status(500).json({ message: "An error occurred with the server. Please try again." }))
  }
})

// DELETE A USER BY ID
app.delete('/api/users/:id', (req, res) => {
  db.remove(req.params.id)
    .then(removed => res.json({ removedItemId: req.params.id }))
    .catch(err => res.status(404).json({ message: "The user with the specified ID does not exist." }))
})

const port = 8000
const host = "127.0.0.1"

app.listen(port, host, () => console.log(`Server listening at http://${host}:${port}`));