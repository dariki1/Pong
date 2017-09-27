class Ball extends GameObject {
    radius : number;
    sX : number;
    sY : number;

    public constructor(radius, speedX, speedY) {
        super();
        this.radius = radius;
        this.sX = speedX;
        this.sY = speedY;
        this.x = 50;
        this.y = 50;
    }    

    public getPixelRad() : number{
        return this.radius*Main.c.height/100;
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

        
        if (nX <= Main.paddleOne.x+2 && Main.paddleOne.y <= nY && Main.paddleOne.y+Main.paddleOne.height >= nY) {//Bounce off paddle one
            this.sX = Math.abs(this.sX);
            nX = this.x + this.sX;
        } else if (nX >= Main.paddleTwo.x && Main.paddleTwo.y <= nY && Main.paddleTwo.y+Main.paddleTwo.height >= nY) {//Bounce off paddle two
            this.sX = Math.abs(this.sX)*-1;
            nX = this.x + this.sX;
        }

        this.x = nX;
        this.y = nY;
    }
}