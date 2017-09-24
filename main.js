//TODO; work on speed and collision code

//Constants
let TAU = Math.PI*2;
//HTML Elements
let c = document.getElementById('c');
let ctx = c.getContext('2d');
//Game Objects
let paddleOne = new Paddle(1);
let paddleTwo = new Paddle(97);
let ball = new Ball();
//Match variable
let running = true;
//Tick variables
let up = false;
let down = false;

(function init() {
    //Used to communicate with the server
    let socket = io();	
    //Add socket listeners
	socket.on('mPing', function(data) {
		console.log("Pinged!");
		socket.emit('mPong');
    });
    //Initial color/style settings
    document.bgColor = 'black';

    c.style.left = '0px';
    c.style.top = '0px';
    c.style.position = 'absolute';
    c.style.border = '10px solid white';

    ctx.fillStyle = "#FFFFFF";

    //Event listeners
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

    window.onresize = function() {
        resize();
    }

    resize();

    //Initialise game loop
    loop();
})();

function resize() {
    if (getWidth() / 2 > getHeight()) {
        c.width = (getHeight()-20)*2;
        c.height = getHeight()-20;
    } else {
        c.width = getWidth()-20;
        c.height = (getWidth()-20)/2;
    }
}

function getWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function getHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function loop() {
    if (running) {
        setTimeout(function() {
            update();
            draw();
            if (ball.x < paddleOne.x+2) {
                alert("P2 wins");
                running = false;
            } else if (ball.x > paddleTwo.x) {
                alert("P1 wins");
                running = false;
            }
            loop();
        }, 16);
    }
}

function update() {
    if (up) {
        paddleOne.move(-0.75);
    }
    if (down) {
        paddleOne.move(0.75);
    }

    paddleTwo.y = ball.y-15;
    //paddleOne.y = ball.y+Math.random()*28-14;

    ball.tick();
}

function draw() {
    ctx.fillStyle = "#FFFFFF";
    //Clear scene
    ctx.clearRect(0,0,c.width,c.height);
    //Draw paddles
    ctx.fillRect(paddleOne.getPixelX(),paddleOne.getPixelY(),2*c.width/100,paddleOne.getPixelHeight());
    ctx.fillRect(paddleTwo.getPixelX(),paddleTwo.getPixelY(),2*c.width/100,paddleTwo.getPixelHeight());
    //Draw ball
    ctx.beginPath();
    ctx.arc(ball.getPixelX(),ball.getPixelY(),ball.getPixelRad(),0,TAU);
    ctx.fill();
}

function Paddle(nX) {
    this.x = nX;
    this.y = 35;
    this.height = 30;

    this.getPixelHeight = function() {
        return this.height*c.height/100;
    }

    this.getPixelY = function() {
        return this.y*c.height/100;
    }

    this.getPixelX = function() {
        return this.x*c.width/100;
    }

    this.move = function(num) {
        let nY = this.y+num;

        if (nY < 0) {
            nY = 0;
        } else if (nY + this.height > 100) {
            nY = 100-this.height;
        }

        this.y = nY;
    }
}

function Ball() {
    this.x = 50;
    this.y = 50;

    this.sX = Math.random()-0.5;
    this.sY = Math.random()-0.5;

    this.sX += Math.sign(this.sX)/2;
    this.sY += Math.sign(this.sY)/2;

    this.radius = 2;

    this.getPixelX = function() {
        return this.x*c.width/100;
    }

    this.getPixelY = function() {
        return this.y*c.height/100;
    }

    this.getPixelRad = function() {
        return this.radius*c.height/100;
    }

    this.tick = function() {
        let nX = this.x + this.sX;
        let nY = this.y + this.sY;
        
        if (nY < 0) {//Bounce off top
            this.sY = Math.abs(this.sY);
            nY = this.y + this.sY;
        } else if (nY > 100) {//Bounce off bottom
            this.sY = Math.abs(this.sY)*-1;
            nY = this.y + this.sY;
        }

        
        if (nX <= paddleOne.x+2 && paddleOne.y <= nY && paddleOne.y+paddleOne.height >= nY) {//Bounce off paddle one
            this.sX = Math.abs(this.sX);
            nX = this.x + this.sX;
        } else if (nX >= paddleTwo.x && paddleTwo.y <= nY && paddleTwo.y+paddleTwo.height >= nY) {//Bounce off paddle two
            this.sX = Math.abs(this.sX)*-1;
            nX = this.x + this.sX;
        }

        this.x = nX;
        this.y = nY;
    }
}