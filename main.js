let c = document.getElementById('c');

(function init() {
	let socket = io();	
	socket.on('mPing', function(data) {
		console.log("Pinged!");
		socket.emit('mPong');
    });
    
    document.bgColor = 'black';

    c.width = 800;
    c.height = 400;
    c.style.left = '0px';
    c.style.top = '0px';
    c.style.position = 'absolute';
    c.style.border = '10px solid white';
})();

function draw() {

}

function update() {

}

function loop() {
    setTimeout(function() {
        draw();
        update();
    }, 16);
}

function Ball() {

}

function Paddle() {
    this.x;
    this.y;
    this.moveUp = function(num) {
        this.y += num;
    }
}