const express     = require('express');
const path        = require('path');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const passport    = require('passport');
const mongoose    = require('mongoose');
const config      = require('./config/database');
const app         = express();
const users       = require('./routes/users');
const port        = process.env.PORT || 8080;

// --
// Database related operations
// --

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

// --
// Middlewares
// --
app.use(cors());
//Public folder is where angular 2 will build files to
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use('/users', users);

//Show public/index.html if no routes are matched
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
