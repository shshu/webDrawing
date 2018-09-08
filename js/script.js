var $canvas = $("canvas");
var context = $canvas[0].getContext("2d");
var lastEvent;
var isMouseDown = false;
var socket = io();
var lineEmit = 'canvas line';

function drawLine(line) {
	context.beginPath();
	context.moveTo(line.start.x,line.start.y);	
	context.lineTo(line.end.x, line.end.y);
	context.strokeStyle = line.color;
	context.stroke();
}

function mouseEnd(){ isMouseDown = false; }

function standardizeEvent(e) {
	if(/^touch/.test(e.type) && e.originalEvent.touches.length == 1) {
		var touchEvent = e.originalEvent.touches[0]; 
		e = {pageX: touchEvent.pageX, pageY: touchEvent.pageY}
	}
	return (typeof(e.offsetX) === 'undefined') ? 
		{offsetX: e.pageX - $canvas.offset().left , offsetY: e.pageY - $canvas.offset().top} :
		{offsetX: e.offsetX, offsetY: e.offsetY};
}

function drawLine(line) {
	context.beginPath();
	context.moveTo(line.start.x,line.start.y);	
	context.lineTo(line.end.x, line.end.y);
	context.stroke();
}

socket.on(lineEmit, function(line){
    drawLine(line)
  });

function getPosition(mouseEvent, sigCanvas) {
    var rect = sigCanvas.getBoundingClientRect();
    return {
      offsetX: mouseEvent.clientX - rect.left,
      offsetY: mouseEvent.clientY - rect.top
    };
}

// for touch devices need to add touchstart touchmove touchend touchcancel
$canvas.mousedown(function(e){
    e.preventDefault();
    lastEvent = standardizeEvent(e);
    isMouseDown = true;
}).mousemove(function(e) {
    e.preventDefault();
    var event = standardizeEvent(e);
    if(isMouseDown) {
        var line = {
			start: {x: lastEvent.offsetX, y: lastEvent.offsetY}, 
			end: {x: event.offsetX, y: event.offsetY},
		}
		drawLine(line);
        socket.emit(lineEmit, line);
        lastEvent = standardizeEvent(e);
    }
    lastEvent = e;
}).mouseup(function (e) {
    mouseEnd();
}).mouseleave(function (e) {
    mouseEnd();
});

function clearCanvasAction() {
    socket.emit('clear all');
}

function clearCanvas() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

socket.on('draw line', function(data){
    drawLine(data)
  });

socket.on('clear all', function(){
    clearCanvas();
  });