class Comm {
    public static send(type, message) : void{
        jsSend(type, message);
    }

    public static addMessageListener(type, callback) : void {
        jsAddMessageListener(type, callback);
    }

    public static init() {
        this.addMessageListener('gameUpdate', function(msg) {
            if (msg[0] == 'newGame') {
                Main.newGame();
            } else if (msg[0] == 'moveUpdate') {
                Main.game.paddleTwo.down = msg[1][1];
                Main.game.paddleTwo.up = msg[1][0];
            } else if (msg[0] == 'gameDone') {
                Main.game.running = false;
                GUI.message("GAME OVER! Winner; " + msg[1][0], 180);
            }
        });
    }

    //Should probably move this to another class
    public static update() {
        let msg = [];
        msg[0] = 'moveUpdate';
        msg[1] = [];
        msg[1][1] = Main.game.paddleOne.down;
        msg[1][0] = Main.game.paddleOne.up;
        this.send('gameUpdate',msg);
    }
}