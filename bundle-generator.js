class Point{
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

({
    zoom: 1,
    
    position: new Point(0, 0)
});

const canvas = document.createElement("canvas");
canvas.getContext("2d");

/*
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 */
canvas.width = 800;
canvas.height = 600;

document.body.appendChild(canvas);

document.body.style.backgroundColor = "rgba(29,28,28,0.86)";

class View{
    ctx;
    
    offset;
    
    LIMIT_MIN_X=-100;
    LIMIT_MIN_Y=-100;
    
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.offset = new Point(0,0);
        
        const prevPoint = {
            x: 0,
            y: 0
        };
        
        const self = this;
        
        function onMouseMove(e){
            
            self.offset = new Point(
                Math.max(offsetPoint.x + prevPoint.x - e.x, self.LIMIT_MIN_X),
                Math.max(offsetPoint.y + prevPoint.y- e.y, self.LIMIT_MIN_Y)
            );
        
            prevPoint.x = e.x;
            prevPoint.y = e.y;
        }
        function onMouseDown(e){
            prevPoint.x = e.x ;
            prevPoint.y = e.y;
        
            canvas.addEventListener("mousemove", onMouseMove, {passive: true});
            canvas.addEventListener("mouseup", onMouseLeave);
            canvas.addEventListener("mouseleave", onMouseLeave);
        }
        function onMouseLeave(){
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("mouseleave", onMouseMove);
            canvas.removeEventListener("mouseup", onMouseMove);
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
    

}

const view = new View(canvas);

function draw() {
    
    const ctx = view.ctx;
    
    ctx.fillStyle = "#2e2d2d";
    ctx.fillRect(0, 0, 800, 600);
    
    
    ctx.strokeStyle = "white";
    ctx.beginPath();       // Начинает новый путь
    ctx.moveTo(-offsetPoint.x, -offsetPoint.y);
    ctx.lineTo(-offsetPoint.x, -offsetPoint.y+600);
    ctx.moveTo(-offsetPoint.x, -offsetPoint.y);
    ctx.lineTo(-offsetPoint.x + 800, -offsetPoint.y);
    ctx.stroke();
    
}
setInterval(draw, 1000 / 30);
