let c = document.getElementById('c');
let ctx = c.getContext('2d');
let paddleOne = new Paddle(10);
let paddleTwo = new Paddle(780);
let ball = new Ball();
let TAU = Math.PI*2;
let up = false;
let down = false;

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

    ctx.fillStyle = "#FFFFFF";

    window.addEventListener("keydown", function(e) {
        if (e.keyCode == 40) {//Down
            down = true;
        } else if (e.keyCode == 38) {//Up
            up = true;
        }
    });

    window.addEventListener("keyup", function(e) {
        if (e.keyCode == 40) {//Down
            down = false;
        } else if (e.keyCode == 38) {//Up
            up = false;
        }
    });

    loop();
})();

function draw() {
    ctx.clearRect(0,0,800,400);
    ctx.fillRect(paddleOne.x,paddleOne.y,10,paddleOne.height);
    ctx.fillRect(paddleTwo.x,paddleTwo.y,10,paddleTwo.height);
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,5,0,TAU);
    ctx.fill();
    ctx.stroke();
}

function update() {
    if (up) {
        paddleOne.move(-1);
    }
    if (down) {
        paddleOne.move(1);
    }
    ball.tick();
}

function loop() {
    setTimeout(function() {
        draw();
        update();
        loop();
    }, 16);
}

function Ball() {
    this.x = 395;
    this.y = 195;
    this.sX = Math.sign(Math.random()-0.5)*Math.random()*3;
    this.sY = Math.sign(Math.random()-0.5)*Math.random()*3;
    this.tick = function() {
        let nX = this.x + this.sX;
        let nY = this.y + this.sY;

        if (this.x-5 < paddleOne.x+10) {
            alert("P2 wins");
        } else if (this.x+5 > paddleTwo.x) {
            alert("P1 wins");
        }

        if (nY < 0) {
            this.sY *= -1;
            nY = this.y+this.sY;
        } else if (nY > 400) {
            this.sY *= -1;
            nY = this.y+this.sY;
        }

        if (nX-5 <= paddleOne.x+10 && paddleOne.y <= nY && paddleOne.y+paddleOne.height >= nY) {
            this.sX *= -1;
            nX = this.x+this.sX;
        } else if (nX+5 >= paddleTwo.x && paddleTwo.y <= nY && paddleTwo.y+paddleTwo.height >= nY) {
            this.sX *= -1;
            nX = this.X+this.sX;
        }

        this.x += this.sX;
        this.y += this.sY;
        
    }
}

function Paddle(nX) {
    this.x = nX;
    this.y = 170;
    this.height = 60;

    this.move = function(num) {
        let nY = this.y+num;

        if (nY < 0) {
            nY = 0;
        } else if (nY + this.height > 400) {
            nY = 400-this.height;
        }

        this.y = nY;
    }
}