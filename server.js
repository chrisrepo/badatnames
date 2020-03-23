require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const app = express();
const port = process.env.PORT || 4000;
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'us3'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.post('/paint', (req, res) => {
  pusher.trigger('painting', 'draw', req.body);
  res.json(req.body);
});

var userList = [];

app.post('/login', (req, res) => {
  pusher.trigger('painting', 'user', req.body);
  userList.push(req.body.username);
  console.log(userList);
  res.json(req.body);
});

app.get('/userList', (req, res) => {
  console.log('sent list of users');
  res.json(userList);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
