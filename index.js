var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var layout = [];

app.use(express.static('js'))
app.use(express.static('style'))

app.get('/', function(req, res){
    res.sendFile(__dirname+'/index.html');
});

io.on('connect', function(socket){
    for(var i = 0; i < layout.length; i++) {
        io.emit('draw line', layout[i]);
    }
  });

io.on('connection', function(socket){
    socket.on('canvas line', function(data){
            layout.push(data)
            io.emit('draw line', data);
        });
    socket.on('clear all', function() {
        layout = [];
        io.emit('clear all');
    });
  });

http.listen(3000, function(){
    console.log('listening on *:3000');
});
