class Util {
    public static getWidth() : number {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    public static getHeight() : number {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }
}