import Point from "./class/point-class";

export default class View{
    ctx;
    
    offset;
    
    LIMIT_MIN_X=-100;
    LIMIT_MIN_Y=-100;
    
    moving = false;
    
    isLockMove = false;
    
    constructor(canvas) {
        
        
        this.ctx = canvas.getContext("2d");
        this.offset = new Point(0,0);
        
        const prevPoint = {
            x: 0,
            y: 0
        }
        
        const self = this;
        
        function onMouseMove(e){
            self.moving = true;

            self.offset = new Point(
                Math.max(self.offset.x + prevPoint.x - e.x, self.LIMIT_MIN_X),
                Math.max(self.offset.y + prevPoint.y- e.y, self.LIMIT_MIN_Y)
            )
        
            prevPoint.x = e.x;
            prevPoint.y = e.y;
        }
        function onMouseDown(e){
            
            
            if (self.isLockMove) return;
            
            prevPoint.x = e.x ;
            prevPoint.y = e.y;
        
            canvas.addEventListener("mousemove", onMouseMove, {passive: true});
            canvas.addEventListener("mouseup", onMouseLeave);
            canvas.addEventListener("mouseleave", onMouseLeave);
        }
        function onMouseLeave(e){
            
            self.moving = false;

            canvas.removeEventListener("mousemove", onMouseMove)
            canvas.removeEventListener("mouseleave", onMouseLeave)
            canvas.removeEventListener("mouseup", onMouseLeave)
        }
    
        canvas.addEventListener("mousedown", onMouseDown);

        /*
        canvas.addEventListener("click", e => {
        
            const x = e.x + offsetPoint.x;
            const y = e.y + offsetPoint.y;
        
            let unit = array.find(elem => checkPointInsideRectangle(elem.Point, {x: elem.Point.x + elem.size.width, y: elem.Point.y + elem.size.height}, {x,y}))
        
            activeBlock = unit;
        
        })*/
    
    
    }
    
    lockMove(){
        this.isLockMove = true;
    }
    unlockMove(){
        this.isLockMove = false;
    }
    

}