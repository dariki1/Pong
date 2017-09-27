class Ball {
    radius : number;
    sX : number;
    sY : number;
    x : number;
    y : number;

    public constructor(radius, speedX, speedY) {
        this.radius = radius;
        this.sX = speedX;
        this.sY = speedY;
        this.x = 50;
        this.y = 50;
    }    

    public getPixelRad() : number{
        return this.radius*GUI.c.height/100;
    }

    public tick() : void {
        let nX = this.x + this.sX;
        let nY = this.y + this.sY;
        
        if (nY < 0) {//Bounce off top
            this.sY = Math.abs(this.sY);
            nY = this.y + this.sY;
        } else if (nY > 100) {//Bounce off bottom
            this.sY = Math.abs(this.sY)*-1;
            nY = this.y + this.sY;
        }

        
        if (nX <= Main.game.paddleOne.x+2 && Main.game.paddleOne.y <= nY && Main.game.paddleOne.y+Main.game.paddleOne.height >= nY) {//Bounce off paddle one
            this.sX = Math.abs(this.sX);
            nX = this.x + this.sX;
        } else if (nX >= Main.game.paddleTwo.x && Main.game.paddleTwo.y <= nY && Main.game.paddleTwo.y+Main.game.paddleTwo.height >= nY) {//Bounce off paddle two
            this.sX = Math.abs(this.sX)*-1;
            nX = this.x + this.sX;
        }

        this.x = nX;
        this.y = nY;
    }
}