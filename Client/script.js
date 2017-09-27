class Comm {
    static send(type, message) {
        jsSend(type, message);
    }
    static addMessageListener(type, callback) {
        jsAddMessageListener(type, callback);
    }
    static init() {
        this.addMessageListener('gameUpdate', function (msg) {
            if (msg[0] == 'newGame') {
                Main.newGame();
            }
            else if (msg[0] == 'moveUpdate') {
                Main.game.paddleTwo.down = msg[1][1];
                Main.game.paddleTwo.up = msg[1][0];
            }
            else if (msg[0] == 'gameDone') {
                Main.game.running = false;
                GUI.message("GAME OVER! Winner; " + msg[1][0], 180);
            }
        });
    }
    //Should probably move this to another class
    static update() {
        let msg = [];
        msg[0] = 'moveUpdate';
        msg[1] = [];
        msg[1][1] = Main.game.paddleOne.down;
        msg[1][0] = Main.game.paddleOne.up;
        this.send('gameUpdate', msg);
    }
}
class Game {
    constructor(ballPara) {
        //Match variable
        this.running = false;
        this.paddleOne = new Paddle(1);
        this.paddleTwo = new Paddle(97);
        this.ball = new Ball(ballPara[0], ballPara[1], ballPara[2]);
    }
    loop() {
        setTimeout(function () {
            if (Main.game.running) {
                Main.game.update();
                GUI.draw();
                if (Main.game.ball.x < Main.game.paddleOne.x + 2) {
                    Comm.send('gameUpdate', ['gameLost']);
                    Main.game.running = false;
                }
                Main.game.loop();
            }
        }, 16);
    }
    update() {
        this.paddleOne.tick();
        this.paddleTwo.tick();
        this.ball.tick();
    }
}
class GUI {
    static init() {
        this.ctx = this.c.getContext('2d');
        //Initial color/style settings
        document.bgColor = 'black';
        this.c.style.left = '0px';
        this.c.style.top = '0px';
        this.c.style.position = 'absolute';
        this.c.style.border = '10px solid white';
        this.ctx.fillStyle = "#FFFFFF";
    }
    static draw() {
        this.ctx.fillStyle = "#FFFFFF";
        //Clear scene
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        //Draw paddles
        GHandler.drawPaddle(Main.game.paddleOne);
        GHandler.drawPaddle(Main.game.paddleTwo);
        //Draw ball
        GHandler.drawBall(Main.game.ball);
        //Draw text
        for (let i = this.messages.length - 1; i >= 0; i--) {
            this.ctx.fillText(this.messages[i][0], 10, i * 10);
            this.messages[i][1]--;
            if (this.messages[i][1] <= 0) {
                this.messages.splice(i, 1);
                i--;
            }
        }
    }
    static message(message, time) {
        this.messages.push([message, time]);
    }
    static resize() {
        if (Util.getWidth() / 2 > Util.getHeight()) {
            this.c.width = (Util.getHeight() - 20) * 2;
            this.c.height = Util.getHeight() - 20;
        }
        else {
            this.c.width = Util.getWidth() - 20;
            this.c.height = (Util.getWidth() - 20) / 2;
        }
    }
}
GUI.c = document.getElementById('c');
GUI.messages = [];
class Main {
    static newGame() {
        Comm.addMessageListener('start', function (msg) {
            Main.game = new Game(msg);
            Main.game.running = true;
            Comm.addMessageListener('stop', function (msg) {
                Main.game.running = false;
            });
            Main.game.loop();
        });
    }
    static init() {
        //Event listeners
        window.addEventListener("keydown", function (e) {
            if (e.keyCode == 40) {
                Main.game.paddleOne.down = true;
                Comm.update();
            }
            else if (e.keyCode == 38) {
                Main.game.paddleOne.up = true;
                Comm.update();
            }
        });
        window.addEventListener("keyup", function (e) {
            if (e.keyCode == 40) {
                Main.game.paddleOne.down = false;
                Comm.update();
            }
            else if (e.keyCode == 38) {
                Main.game.paddleOne.up = false;
                Comm.update();
            }
        });
        window.onresize = function () {
            GUI.resize();
        };
        Comm.init();
        GUI.init();
        GUI.resize();
        Comm.send('gameUpdate', ['newGame']);
        this.newGame();
    }
}
//Constants
Main.TAU = Math.PI * 2;
class Util {
    static getWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
    static getHeight() {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }
}
class Ball {
    constructor(radius, speedX, speedY) {
        this.radius = radius;
        this.sX = speedX;
        this.sY = speedY;
        this.x = 50;
        this.y = 50;
    }
    getPixelRad() {
        return this.radius * GUI.c.height / 100;
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
        if (nX <= Main.game.paddleOne.x + 2 && Main.game.paddleOne.y <= nY && Main.game.paddleOne.y + Main.game.paddleOne.height >= nY) {
            this.sX = Math.abs(this.sX);
            nX = this.x + this.sX;
        }
        else if (nX >= Main.game.paddleTwo.x && Main.game.paddleTwo.y <= nY && Main.game.paddleTwo.y + Main.game.paddleTwo.height >= nY) {
            this.sX = Math.abs(this.sX) * -1;
            nX = this.x + this.sX;
        }
        this.x = nX;
        this.y = nY;
    }
}
class Paddle {
    constructor(newXPos) {
        this.y = 35;
        this.height = 30;
        this.up = false;
        this.down = false;
        this.speed = .75;
        this.x = newXPos;
    }
    getPixelHeight() {
        return this.height * GUI.c.height / 100;
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
    tick() {
        if (this.up) {
            this.move(this.speed * -1);
        }
        if (this.down) {
            this.move(this.speed);
        }
    }
}
class GHandler {
    static drawBall(ball) {
        GUI.ctx.beginPath();
        GUI.ctx.arc(this.getPixelX(ball), this.getPixelY(ball), ball.getPixelRad(), 0, Main.TAU);
        GUI.ctx.fill();
    }
    static drawPaddle(paddle) {
        GUI.ctx.fillRect(this.getPixelX(paddle), this.getPixelY(paddle), 2 * GUI.c.width / 100, paddle.getPixelHeight());
    }
    static getPixelX(obj) {
        let ret = obj.x * GUI.c.width / 100;
        /*if (ret < 0 || ret > GUI.c.width) {
            console.log("X; c " + GUI.c.width + " r; "  + ret);
        }*/
        return ret;
    }
    static getPixelY(obj) {
        let ret = obj.y * GUI.c.height / 100;
        if (ret < 0 || ret > GUI.c.height) {
            console.log("OY; " + obj.y);
            console.log("CY; " + GUI.c.height);
            console.log("Y; c " + GUI.c.height + " r; " + ret);
        }
        return ret;
    }
}
