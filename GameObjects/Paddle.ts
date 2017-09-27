class Paddle extends GameObject {
    x : number;
    y : number = 35;
    height : number = 30;

    constructor(newXPos) {
        super();
        this.x = newXPos;
    }

    public getPixelHeight() : number {
        return this.height*Main.c.height/100;
    }

    public move(num) : void {
        let nY = this.y+num;

        if (nY < 0) {
            nY = 0;
        } else if (nY + this.height > 100) {
            nY = 100-this.height;
        }

        this.y = nY;
    }
}