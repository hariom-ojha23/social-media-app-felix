var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// models

const User = require('./models/user');
const Post = require('./models/post');


// setting up connection

const mongoose = require('mongoose');
const { mongoUrl } = require('./config');

const connect = mongoose.connect(mongoUrl, { useNewUrlParser: true,  useUnifiedTopology: true } )

connect.then(() => {
  console.log("connected correctly to mongo");
}, (err) => {
  console.log(err);
});

var app = express();

// Routers

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/post');
var profileRouter = require('./routes/profile');


//XpgiU7VSg9aRax4

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// using routers

app.use('/', usersRouter);
app.use('/post', postRouter );
app.use('/user', profileRouter );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
