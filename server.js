let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let port = 80;

//Start server on port
server.listen(port, function() {
	output("Listening on port *:" + port);
});

//Landing page
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//When there is a new connection
io.on('connection', function(socket){
	function send(event, message) {
		socket.emit(event, message);
	}
	
	output("Connection from " + socket.id);
	send('mPing','TEST');
	
	socket.on('mPong', function(msg) {
		output("Connection confirmed from " + socket.id);
	});
	
	socket.on('disconnect', function() {
		output("User disconnected");
		broadcast('User disconnection');
	});
});

function broadcast(message) {
	io.emit('b', message);
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

addJS('/');