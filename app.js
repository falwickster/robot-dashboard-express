var express = require('express'),
    socket_io = require('socket.io'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express();

var routes = require('./routes/index');
var users = require('./routes/users');
//SocketIO and mqtt requirements
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost');
var io = socket_io();
app.io = io;

//SocketIO
io.on('connection', function(socket) {
   console.log('a user connected');
    socket.on('disconnect', function() {
       console.log('user disconnected');
    });
});

//mqtt

client.on('connect', function () {
  client.subscribe('presence');
  
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  //client.end();
    io.emit('mqtt', message.toString());
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
