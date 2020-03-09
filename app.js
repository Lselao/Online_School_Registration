const createError = require('http-errors');
const express = require('express');
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mssql = require("mssql");
const sql = require("mssql/msnodesqlv8");



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const searchRouter = require("./routes/search");
const registerRouter = require("./routes/register");
const facultyRouter = require("./routes/faculty");

const app = express();
const cons = require('consolidate');
var session = require('client-sessions');

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//create sessions
app.use(session({
  cookieName: 'session',
  secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD',
  duration: 24*60*60*1000,
  activeDuration: 5*60*1000,
}));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/search", searchRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/faculty', facultyRouter);



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
