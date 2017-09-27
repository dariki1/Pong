abstract class GameObject {
    x : number;
    y : number;

    public getPixelX() : number {
        return this.x*Main.c.width/100;
    }

    public getPixelY() : number {
        return this.y*Main.c.height/100;
    }
}