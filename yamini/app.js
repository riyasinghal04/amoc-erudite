//user input validation with express and joi

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const joi = require('joi');
var mongoose = require('mongoose');

var User = require('./user');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/yamsignup',  {useUnifiedTopology: true,useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});


//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }));


app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({extended: false}));

// include routes
var routes = require('./routes/router');
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});