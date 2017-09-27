class GHandler {
    public static drawBall(ball : Ball) : void {
        GUI.ctx.beginPath();
        GUI.ctx.arc(this.getPixelX(ball),this.getPixelY(ball),ball.getPixelRad(),0,Main.TAU);
        GUI.ctx.fill();
    }

    public static drawPaddle(paddle : Paddle) : void {
        GUI.ctx.fillRect(this.getPixelX(paddle),this.getPixelY(paddle),2*GUI.c.width/100,paddle.getPixelHeight());
    }

    public static getPixelX(obj) : number {
        return obj.x*GUI.c.width/100;;
    }

    public static getPixelY(obj) : number {
        return obj.y*GUI.c.height/100;;
    }
}