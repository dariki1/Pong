class Paddle {
    x : number;
    y : number = 35;
    height : number = 30;
    up : boolean = false;
    down : boolean = false;
    speed : number = .75;

    constructor(newXPos) {
        this.x = newXPos;
    }

    public getPixelHeight() : number {
        return this.height*GUI.c.height/100;
    }

    private move(num) : void {
        let nY = this.y+num;

        if (nY < 0) {
            nY = 0;
        } else if (nY + this.height > 100) {
            nY = 100-this.height;
        }

        this.y = nY;
    }

    public tick() : void {
        if (this.up) {
            this.move(this.speed*-1);
        }
        if (this.down) {
            this.move(this.speed);
        }
    }
}