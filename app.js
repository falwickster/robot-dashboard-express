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
//var client = mqtt.connect('mqtt://192.168.1.5');
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
    client.subscribe([
        "Gripper/Alive",
        "Arm/Alive",
        "Chassis/Alive",
        "Gps/Alive",
        "GpsUSB/Alive",
        
        "Gripper/GripperCurrent",
        "Gripper/MoveCurrent",
        "Gripper/RotateCurrent",
        "Gripper/RotatePosition",
        "Gripper/Voltage",
        
        "Arm/BarkCurrent",
        "Arm/BarkPosition",
        "Arm/LokiecCurrent",
        "Arm/LokiecPosition",
        "Arm/ObrotCurrent",
        "Arm/ObrotPosition",
        
        "GpsUSB/LatitudeDD",
        "GpsUSB/LongitudeDD",
        "GpsUSB/Track",
        "GpsUSB/Speed",
        
        "Chassis/AkuMot",
        "Chassis/AkuEle"
    ]);
//  client.subscribe('Gripper/Alive');
//  client.subscribe('Arm/Alive');
//  client.subscribe("Chassis/Alive");
//  client.subscribe("Gps/Alive");
//  client.subscribe("GpsUSB/Alive");
//    
//  client.subscribe("Gripper/GripperCurrent");
//  client.subscribe("Gripper/MoveCurrent");
//  client.subscribe("Gripper/RotateCurrent");
//  client.subscribe("Gripper/RotatePosition");
//  client.subscribe("Gripper/Voltage");
//    
//  client.subscribe("Arm/BarkCurrent");
//  client.subscribe("Arm/BarkPosition");
//  client.subscribe("Arm/LokiecCurrent");
//  client.subscribe("Arm/LokiecPosition");
//  client.subscribe("Arm/ObrotCurrent");
//  client.subscribe("Arm/ObrotPosition");   
//   
//  client.subscribe("GpsUSB/LatitudeDD");
//  client.subscribe("GpsUSB/LongitudeDD");
//  client.subscribe("GpsUSB/Track");
//  client.subscribe("GpsUSB/Speed");    
//    
//  client.subscribe("Chassis/AkuMot");
//  client.subscribe("Chassis/AkuEle");
});

client.on('message', function (topic, payload) {
  console.log(topic+'='+payload);
  io.emit('mqtt', {'topic':String(topic), 'payload':String(payload)});
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
