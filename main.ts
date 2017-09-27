class Main {
    //Constants
    static TAU : number = Math.PI*2;
    //HTML Elements
    static c : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('c');
    static ctx : CanvasRenderingContext2D;
    //Game Objects
    public static paddleOne : Paddle;
    public static paddleTwo : Paddle;
    public static ball : Ball;
    //Match variable
    static running : boolean = true;
    //Tick variables
    static up : boolean = false;
    static down : boolean = false;

    public static newGame() {
        Main.paddleOne = new Paddle(1);
        Main.paddleTwo = new Paddle(97);
        Main.ball = new Ball(2, Math.random()*2-1, Math.random()*2-1);

        Main.loop();
    }

    public static init() : void {
        Main.ctx = this.c.getContext('2d');
        //Initial color/style settings
        document.bgColor = 'black';

        Main.c.style.left = '0px';
        Main.c.style.top = '0px';
        Main.c.style.position = 'absolute';
        Main.c.style.border = '10px solid white';

        Main.ctx.fillStyle = "#FFFFFF";

        //Event listeners
        window.addEventListener("keydown", function(e) {
            if (e.keyCode == 40) {//Down
                Main.down = true;
            } else if (e.keyCode == 38) {//Up
                Main.up = true;
            }
        });

        window.addEventListener("keyup", function(e) {
            if (e.keyCode == 40) {//Down
                Main.down = false;
            } else if (e.keyCode == 38) {//Up
                Main.up = false;
            }
        });

        window.onresize = function() {
            Main.resize();
        }

        Main.resize();

        //Initialise game loop
        Main.newGame()
    }

    public static resize() : void {
        if (Main.getWidth() / 2 > Main.getHeight()) {
            this.c.width = (Main.getHeight()-20)*2;
            this.c.height = Main.getHeight()-20;
        } else {
            this.c.width = Main.getWidth()-20;
            this.c.height = (Main.getWidth()-20)/2;
        }
    }

    public static getWidth() : number {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    public static getHeight() : number {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    public static loop() : void {
        if (Main.running) {
            setTimeout(function() {
                Main.update();
                Main.draw();
                if (Main.ball.x < Main.paddleOne.x+2) {
                    alert("P2 wins");
                    Main.running = false;
                } else if (Main.ball.x > Main.paddleTwo.x) {
                    alert("P1 wins");
                    Main.running = false;
                }
                Main.loop();
            }, 16);
        }
    }

    public static update() : void {
        if (Main.up) {
            Main.paddleOne.move(-0.75);
        }
        if (Main.down) {
            Main.paddleOne.move(0.75);
        }

        Main.paddleTwo.y = Main.ball.y-15;
        //paddleOne.y = ball.y+Math.random()*28-14;

        Main.ball.tick();
    }

    public static draw() : void{
        Main.ctx.fillStyle = "#FFFFFF";
        //Clear scene
        Main.ctx.clearRect(0,0,this.c.width,this.c.height);
        //Draw paddles        
        Main.ctx.fillRect(Main.paddleOne.getPixelX(),Main.paddleOne.getPixelY(),2*this.c.width/100,Main.paddleOne.getPixelHeight());
        Main.ctx.fillRect(Main.paddleTwo.getPixelX(),Main.paddleTwo.getPixelY(),2*this.c.width/100,Main.paddleTwo.getPixelHeight());
        //Draw ball
        Main.ctx.beginPath();
        Main.ctx.arc(Main.ball.getPixelX(),Main.ball.getPixelY(),Main.ball.getPixelRad(),0,Main.TAU);
        Main.ctx.fill();
    }
}