class Main {
    //Constants
    static TAU : number = Math.PI*2;
    //Game
    static game : Game;

    public static newGame() {
        Comm.addMessageListener('start', function(msg) {
            Main.game = new Game(msg);
            Main.game.running = true;
            Comm.addMessageListener('stop', function(msg) { 
                Main.game.running = false;
            });
            Main.game.loop();
        });
    }

    public static init() : void {
        //Event listeners
        window.addEventListener("keydown", function(e) {
            if (e.keyCode == 40) {//Down
                Main.game.paddleOne.down = true;
                Comm.update();
            } else if (e.keyCode == 38) {//Up
                Main.game.paddleOne.up = true;
                Comm.update();
            }
        });

        window.addEventListener("keyup", function(e) {
            if (e.keyCode == 40) {//Down
                Main.game.paddleOne.down = false;
                Comm.update();
            } else if (e.keyCode == 38) {//Up
                Main.game.paddleOne.up = false;
                Comm.update();
            }
        });

        window.onresize = function() {
            GUI.resize();
        }

        Comm.init();

        GUI.init();
        GUI.resize();

        Comm.send('gameUpdate',['newGame']);
        this.newGame()
    }
}