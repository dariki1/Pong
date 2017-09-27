class Main {
    static newGame() {
        Main.paddleOne = new Paddle(1);
        Main.paddleTwo = new Paddle(97);
        Main.ball = new Ball(2, Math.random() * 2 - 1, Math.random() * 2 - 1);
        Main.loop();
    }
    static init() {
        Main.ctx = this.c.getContext('2d');
        //Initial color/style settings
        document.bgColor = 'black';
        Main.c.style.left = '0px';
        Main.c.style.top = '0px';
        Main.c.style.position = 'absolute';
        Main.c.style.border = '10px solid white';
        Main.ctx.fillStyle = "#FFFFFF";
        //Event listeners
        window.addEventListener("keydown", function (e) {
            if (e.keyCode == 40) {
                Main.down = true;
            }
            else if (e.keyCode == 38) {
                Main.up = true;
            }
        });
        window.addEventListener("keyup", function (e) {
            if (e.keyCode == 40) {
                Main.down = false;
            }
            else if (e.keyCode == 38) {
                Main.up = false;
            }
        });
        window.onresize = function () {
            Main.resize();
        };
        Main.resize();
        //Initialise game loop
        Main.newGame();
    }
    static resize() {
        if (Main.getWidth() / 2 > Main.getHeight()) {
            this.c.width = (Main.getHeight() - 20) * 2;
            this.c.height = Main.getHeight() - 20;
        }
        else {
            this.c.width = Main.getWidth() - 20;
            this.c.height = (Main.getWidth() - 20) / 2;
        }
    }
    static getWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
    static getHeight() {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }
    static loop() {
        if (Main.running) {
            setTimeout(function () {
                Main.update();
                Main.draw();
                if (Main.ball.x < Main.paddleOne.x + 2) {
                    alert("P2 wins");
                    Main.running = false;
                }
                else if (Main.ball.x > Main.paddleTwo.x) {
                    alert("P1 wins");
                    Main.running = false;
                }
                Main.loop();
            }, 16);
        }
    }
    static update() {
        if (Main.up) {
            Main.paddleOne.move(-0.75);
        }
        if (Main.down) {
            Main.paddleOne.move(0.75);
        }
        Main.paddleTwo.y = Main.ball.y - 15;
        //paddleOne.y = ball.y+Math.random()*28-14;
        Main.ball.tick();
    }
    static draw() {
        Main.ctx.fillStyle = "#FFFFFF";
        //Clear scene
        Main.ctx.clearRect(0, 0, this.c.width, this.c.height);
        //Draw paddles        
        Main.ctx.fillRect(Main.paddleOne.getPixelX(), Main.paddleOne.getPixelY(), 2 * this.c.width / 100, Main.paddleOne.getPixelHeight());
        Main.ctx.fillRect(Main.paddleTwo.getPixelX(), Main.paddleTwo.getPixelY(), 2 * this.c.width / 100, Main.paddleTwo.getPixelHeight());
        //Draw ball
        Main.ctx.beginPath();
        Main.ctx.arc(Main.ball.getPixelX(), Main.ball.getPixelY(), Main.ball.getPixelRad(), 0, Main.TAU);
        Main.ctx.fill();
    }
}
//Constants
Main.TAU = Math.PI * 2;
//HTML Elements
Main.c = document.getElementById('c');
//Match variable
Main.running = true;
//Tick variables
Main.up = false;
Main.down = false;
class GameObject {
    getPixelX() {
        return this.x * Main.c.width / 100;
    }
    getPixelY() {
        return this.y * Main.c.height / 100;
    }
}
class Ball extends GameObject {
    constructor(radius, speedX, speedY) {
        super();
        this.radius = radius;
        this.sX = speedX;
        this.sY = speedY;
        this.x = 50;
        this.y = 50;
    }
    getPixelRad() {
        return this.radius * Main.c.height / 100;
    }
    tick() {
        let nX = this.x + this.sX;
        let nY = this.y + this.sY;
        if (nY < 0) {
            this.sY = Math.abs(this.sY);
            nY = this.y + this.sY;
        }
        else if (nY > 100) {
            this.sY = Math.abs(this.sY) * -1;
            nY = this.y + this.sY;
        }
        if (nX <= Main.paddleOne.x + 2 && Main.paddleOne.y <= nY && Main.paddleOne.y + Main.paddleOne.height >= nY) {
            this.sX = Math.abs(this.sX);
            nX = this.x + this.sX;
        }
        else if (nX >= Main.paddleTwo.x && Main.paddleTwo.y <= nY && Main.paddleTwo.y + Main.paddleTwo.height >= nY) {
            this.sX = Math.abs(this.sX) * -1;
            nX = this.x + this.sX;
        }
        this.x = nX;
        this.y = nY;
    }
}
class Paddle extends GameObject {
    constructor(newXPos) {
        super();
        this.y = 35;
        this.height = 30;
        this.x = newXPos;
    }
    getPixelHeight() {
        return this.height * Main.c.height / 100;
    }
    move(num) {
        let nY = this.y + num;
        if (nY < 0) {
            nY = 0;
        }
        else if (nY + this.height > 100) {
            nY = 100 - this.height;
        }
        this.y = nY;
    }
}
class GHandler {
    static drawBall(ball, context) {
    }
    static drawPaddle(paddle, context) {
    }
}
/*import * as express from 'express';
import * as io from 'socket.io';

class Comm {
    //Add socket listeners
    socket : SocketIO.Server = io();
    
    socket.on('mPing', function(data) {
        console.log("Pinged!");
        socket.emit('mPong');
    });
}*/ 
