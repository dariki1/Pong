let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let port = 80;
let pOne;
let pTwo;

//Start server on port
server.listen(port, function() {
	output("Listening on port *:" + port);
});

//Landing page
app.get('/', function(req, res){
	res.sendFile(__dirname + '/Client/index.html');
});

//When there is a new connection
io.on('connection', function(socket){
	if (pOne == undefined) {
		pOne = socket;
	} else if (pTwo == undefined) {
		pTwo = socket;
	}
	function send(event, message) {
		socket.emit(event, message);
	}
	
	output("Connection from " + socket.id);

	socket.on('gameUpdate', function(msg) {
		output("Update from; " + socket.id + ", message; " + msg);
		if (msg[0] == 'newGame') {
			broadcast('gameUpdate',['newGame']);
			if (pOne != undefined && pTwo != undefined) {
				broadcast('start', [2, Math.random()*2-1, Math.random()*2-1]);
			}
		} else if (msg[0] == 'moveUpdate') {
			if (socket.id == pOne.id) {
				pTwo.emit('gameUpdate', ['moveUpdate', msg[1]]);
			} else if (socket.id == pTwo.id) {
				pOne.emit('gameUpdate', ['moveUpdate', msg[1]]);
			}
		} else if (msg[0] == 'gameLost') {
			if (socket.id == pOne.id) {
				broadcast('gameUpdate', ['gameLost', pTwo.id]);
			} else if (socket.id == pTwo.id) {
				broadcast('gameUpdate', ['gameLost', pOne.id]);
			}
		} else if (msg[0] == 'start') {
			broadcast('gameUpdate', ['start']);
		} else if (msg[0] == 'stop') {
			broadcast('gameUpdate', ['stop']);
		}
	});
	
	socket.on('disconnect', function() {
		output("Disconnection");
		if (pOne != undefined && pOne.id == socket.id) {
			pOne = undefined;
			broadcast('stop');
		} else if (pTwo != undefined && pTwo.id == socket.id) {
			pTwo = undefined;
			broadcast('stop');
		}
	});
});

function broadcast(type, message) {
	output("Broadcasting " + message + " as type " + type);
	io.emit(type, message);
}

function addJS(path) {
	app.use(express.static(__dirname+path));
}

//Output message with time and date
function output(msg) {
	//This is a crazy way of formating dates that even I wouldn't consider... All credit to this; http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
	let time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	console.log("[" + time + "]: " + msg);
}

addJS('/Client/');