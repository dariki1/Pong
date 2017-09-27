class GUI {
    static c : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('c');
    static ctx : CanvasRenderingContext2D;
    private static messages = [];

    public static init() : void {
        this.ctx = this.c.getContext('2d');
        //Initial color/style settings
        document.bgColor = 'black';

        this.c.style.left = '0px';
        this.c.style.top = '0px';
        this.c.style.position = 'absolute';
        this.c.style.border = '10px solid white';

        this.ctx.fillStyle = "#FFFFFF";
    }

    public static draw() : void{
        this.ctx.fillStyle = "#FFFFFF";
        //Clear scene
        this.ctx.clearRect(0,0,this.c.width,this.c.height);
        //Draw paddles
        GHandler.drawPaddle(Main.game.paddleOne);
        GHandler.drawPaddle(Main.game.paddleTwo);
        //Draw ball
        GHandler.drawBall(Main.game.ball);
        //Draw text
        for (let i = this.messages.length-1 ; i >= 0; i--) {
            this.ctx.fillText(this.messages[i][0], 10, i*10);
            this.messages[i][1]--;
            if (this.messages[i][1] <= 0) {
                this.messages.splice(i,1);
                i--;
            }
        }
    }

    public static message(message : string, time : number) : void {
        this.messages.push([message,time]);
    }

    public static resize() : void {
        if (Util.getWidth() / 2 > Util.getHeight()) {
            this.c.width = (Util.getHeight()-20)*2;
            this.c.height = Util.getHeight()-20;
        } else {
            this.c.width = Util.getWidth()-20;
            this.c.height = (Util.getWidth()-20)/2;
        }
    }

}