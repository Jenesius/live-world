import {canvas} from "../../assets/js/core/canvas";
import View from "../../assets/js/core/view";
import Point from "../../assets/js/core/class/point-class";
import "./index.css"
import distanceBetweenPoints from "../../assets/js/core/utils/distanceBetweenPoints";

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
        
    })
    
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
    
    
    let selectedItem = arrayPoints.find(elem => distanceBetweenPoints(elem.position, point) < 5)
    
    if (selectedItem) return refPoint = selectedItem;
    
    
    const newItem = {
        position: point,
        ref: refPoint
    }
    
    arrayPoints.push(newItem);
    
    refPoint = newItem;
    
}

canvas.addEventListener("click", addPoint);
