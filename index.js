//var app = require('express')();
const express = require('express');
var bodyParser =  require("body-parser");
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var emotion = require('./jslib/emotioncollection.js');

app.use(express.static('mini-site-2'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.get('/uicommand', function(req, res){
  res.sendFile(__dirname + '/uicommand.html');
});

app.post('/emotions', function(req, res){
  emotion.addEmotion2DB(req.body);
  res.send("ok");
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    //console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('ui command', function(cmd){
    //console.log('ui command: ' + cmd);
    io.emit('ui command', cmd);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
