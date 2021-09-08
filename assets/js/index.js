import {canvas, ctx} from "./core/canvas";
import "./../css/index.css";
import {array} from "./core/store/index";

const height = 600;
const width  = 800;

const arrayElements = [
    {
        x: 0,
        y: 0,
        
        h: 10,
        w: 10
    },
    {
        x: 200,
        y: 200,
        
        h: 10,
        w: 10
    },
    {
        x: 500,
        y: 400,
        
        h: 10,
        w: 10
    },
    {
        x: 1000,
        y: 20,
        
        h: 10,
        w: 10
    },
    {
        x: 1300,
        y: 20,
        
        h: 10,
        w: 10
    },
]

const offsetPoint = {
    x: 0,
    y: 0
}

function stabilizationPoint(x, y){

}

let activeBlock = null;

/**
 * Функци смотрит, является ли объект в зоне видимости, и нужно ли его рендерить
 * */
function checkRelativeElement({Point, size}) {
    
    if (
        Point.x >= offsetPoint.x && Point.x <= offsetPoint.x +width &&
        Point.y >= offsetPoint.y && Point.y <= offsetPoint.y + height
    ) return true;
    
    return false;
    
}

function checkPointInsideRectangle(cord1, cord2, cordPointer) {
    
    if (cordPointer.x > cord1.x && cordPointer.x < cord2.x && cordPointer.y > cord1.y && cordPointer.y < cord2.y)
    return true;
    
    return false;
}


function draw() {
    
    
    ctx.fillStyle = "#2e2d2d";
    ctx.fillRect(0, 0, 800, 600);
    
    let countRender = 0;
    


    ctx.strokeStyle = "white";
    ctx.beginPath();       // Начинает новый путь
    ctx.moveTo(-offsetPoint.x, -offsetPoint.y);
    ctx.lineTo(-offsetPoint.x, -offsetPoint.y+600);
    ctx.moveTo(-offsetPoint.x, -offsetPoint.y);
    ctx.lineTo(-offsetPoint.x + 800, -offsetPoint.y);
    ctx.stroke();
    
    
    array.forEach(elem => {
        
        if (!checkRelativeElement(elem)) return;
        
        ctx.fillStyle = elem.fill;
        ctx.fillRect(elem.Point.x - offsetPoint.x, elem.Point.y - offsetPoint.y, elem.size.width, elem.size.height);

        countRender++;
    })
    
    document.getElementById("count-render").innerText = String(countRender);
    document.getElementById("offset-x").innerText = String(offsetPoint.x);
    document.getElementById("offset-y").innerText = String(offsetPoint.y);
    document.getElementById("active-block").innerText = activeBlock?.id;
    
}

setInterval(draw, 1000 / 60);


const prevPoint = {
    x: 0,
    y: 0
}

const limitMin = -100;

function onMouseMove(e){
    offsetPoint.x = Math.max(offsetPoint.x + prevPoint.x - e.x, limitMin) ;
    offsetPoint.y = Math.max(offsetPoint.y + prevPoint.y- e.y, limitMin) ;
    
    prevPoint.x = e.x;
    prevPoint.y = e.y;
}
function onMouseDown(e){
    prevPoint.x = e.x ;
    prevPoint.y = e.y;
    
    document.addEventListener("mousemove", onMouseMove, {passive: true})
}
function onMouseUp(){
    document.removeEventListener("mousemove", onMouseMove)

}

document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);

canvas.addEventListener("click", e => {
    
    const x = e.x + offsetPoint.x;
    const y = e.y + offsetPoint.y;
    
    
    let unit = array.find(elem => checkPointInsideRectangle(elem.Point, {x: elem.Point.x + elem.size.width, y: elem.Point.y + elem.size.height}, {x,y}))
    
    
    activeBlock = unit;
    
})

