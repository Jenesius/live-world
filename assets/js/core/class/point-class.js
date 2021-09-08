export default class Point{
    x;
    y;
    constructor(x,y = null) {
        this.x = x;
        this.y = y;
        
        if (y === null) {
            this.x = x.x;
            this.y = x.y;
        }
    }
}