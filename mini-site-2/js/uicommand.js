/**
This script is responsible for letting the server send UI commands to the client page


Todo:
1) save the state of the commands on page refresh or change
**/


var socket;

$.getScript("/socket.io/socket.io.js", function(){
  socket = io();

  $(function () {
    socket.on('ui command', function(cmd){
        eval(cmd);
    });
  });
});
