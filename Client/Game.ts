class Game {
        //Game Objects
        public paddleOne : Paddle;
        public paddleTwo : Paddle;
        public ball : Ball;
        //Match variable
        running : boolean = false;

        constructor(ballPara) {
            this.paddleOne = new Paddle(1);
            this.paddleTwo = new Paddle(97);
            this.ball = new Ball(ballPara[0], ballPara[1], ballPara[2]);
        }

        public loop() : void {
            setTimeout(function() {
                if (Main.game.running) {
                    Main.game.update();
                    GUI.draw();
                    if (Main.game.ball.x < Main.game.paddleOne.x+2) {
                        Comm.send('gameUpdate',['gameLost']);
                        Main.game.running = false;
                    }
                    Main.game.loop();
                }
            }, 16);
        }
    
        public update() : void {
            this.paddleOne.tick();
            this.paddleTwo.tick();    
            this.ball.tick();
        }
}