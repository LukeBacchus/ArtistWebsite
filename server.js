'use strict';

const express = require('express');
const app = express();
const path = require('path');

const { mongoose } = require('./db/mongoose');
mongoose.set('useFindAndModify', false);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));

const sessionsecret =
  process.env.NODE_ENV !== 'production' ? require('./secrets.json').session : process.env.SESSIONSECRET;

const cors = require('cors'); // TODO: should be removed during deployment
app.use(cors());

/*** Session handling **************************************/
app.use(
  session({
    secret: sessionsecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
      httpOnly: true
    }
  })
);

/*** API Routes below ************************************/

app.use(require('./routes/users'));
app.use(require('./routes/posts'));

/*** Webpage routes below **********************************/

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  // TODO: update this to only have a list of valid routes
  // const goodPageRoutes = ['/', '/login', '/dashboard', '/upload', '/'];
  // if (!goodPageRoutes.includes(req.url)) {
  //   // if url not in expected page routes, set status to 404.
  //   res.status(404);
  // }

  // send index.html
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
