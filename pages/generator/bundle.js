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
                Math.max(self.offset.x + prevPoint.x - e.x, self.LIMIT_MIN_X),
                Math.max(self.offset.y + prevPoint.y- e.y, self.LIMIT_MIN_Y)
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

var distanceBetweenPoints = (pointBegin, pointEnd) => {
    return Math.sqrt(Math.pow(pointEnd.x - pointBegin.x, 2) + Math.pow(pointEnd.y - pointBegin.y, 2));
};

const view = new View(canvas);



function draw() {
    
    const ctx = view.ctx;
    
    ctx.fillStyle = "#2e2d2d";
    ctx.fillRect(0, 0, 800, 600);
    
    
    ctx.strokeStyle = "white";
    ctx.beginPath();       // Начинает новый путь
    ctx.moveTo(-view.offset.x, -view.offset.y);
    ctx.lineTo(-view.offset.x, -view.offset.y+600);
    ctx.moveTo(-view.offset.x, -view.offset.y);
    ctx.lineTo(-view.offset.x + 800, -view.offset.y);
    ctx.stroke();
    
    ctx.fillStyle = "red";
    ctx.fillRect(50 - view.offset.x, 50 - view.offset.y, 50, 50);
    
    if (arrayPoints.length)
    arrayPoints.push(arrayPoints[0]);
    
    arrayPoints.forEach(item => {
        
        ctx.fillStyle = "blue";
        ctx.fillRect(item.position.x - view.offset.x, item.position.y - view.offset.y, 2, 2);
        
        if (item.ref) {
            
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.moveTo(item.position.x - view.offset.x, item.position.y - view.offset.y);
            ctx.lineTo(item.ref.position.x - view.offset.x, item.ref.position.y - view.offset.y);
            ctx.stroke();
            ctx.closePath();
            
        }
        
    });
    
    arrayPoints.pop();
    
    if (refPoint) {
        const point  = refPoint.position;
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(point.x - view.offset.x - 3, point.y - view.offset.y - 3,8, 8);
    }
    
}
setInterval(draw, 1000 / 60);

let refPoint = null;

const arrayPoints = [];

function addPoint(e){
    
    e.stopPropagation();
    const point = new Point(e.x + view.offset.x, e.y + view.offset.y);
    
    if (point.x < 0 || point.y <0) return;
    
    
    let selectedItem = arrayPoints.find(elem => distanceBetweenPoints(elem.position, point) < 5);
    
    if (selectedItem) return refPoint = selectedItem;
    
    
    const newItem = {
        position: point,
        ref: refPoint
    };
    
    arrayPoints.push(newItem);
    
    refPoint = newItem;
    
}

canvas.addEventListener("click", addPoint);
