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

let canvas = document.getElementById("canvas");


if (!canvas) {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
}

const ctx = canvas.getContext("2d");

/*
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 */
canvas.width = 800;
canvas.height = 600;



document.body.style.backgroundColor = "rgba(29,28,28,0.86)";

class Size{
    
    width;
    height;
    
    constructor(w, h = null) {
        
        this.width = w;
        this.height = h;
        
        if (h === null) {
            this.width = w;
            this.height = h;
        }
        
        
    }
    
}

const array = [];

array.push({
    id: "1",
    Point: new Point(50, 50),
    size: new Size(50, 50),
    fill: "red"
});

array.push({
    id: "2",
    Point: new Point(100, 50),
    size: new Size(50, 50),
    fill: "green"
});

array.push({
    id: "3",
    Point: new Point(150, 50),
    size: new Size(50, 50),
    fill: "blue"
});

array.push({
    id: "4",
    Point: new Point(50, 150),
    size: new Size(50, 50),
    fill: "yellow"
});

array.push({
    id: "5",
    Point: new Point(450, 550),
    size: new Size(50, 50),
    fill: "gray"
});

array.push({
    id: "6",
    Point: new Point(450, 650),
    size: new Size(50, 50),
    fill: "pink"
});

array.push({
    id: "7",
    Point: new Point(500, 450),
    size: new Size(50, 50),
    fill: "yellow"
});
array.push({
    id: "8",
    Point: new Point(800, 850),
    size: new Size(50, 50),
    fill: "red"
});

const height = 600;
const width  = 800;

const offsetPoint = {
    x: 0,
    y: 0
};

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
    });
    
    document.getElementById("count-render").innerText = String(countRender);
    document.getElementById("offset-x").innerText = String(offsetPoint.x);
    document.getElementById("offset-y").innerText = String(offsetPoint.y);
    document.getElementById("active-block").innerText = activeBlock?.id;
    
}

setInterval(draw, 1000 / 60);


const prevPoint = {
    x: 0,
    y: 0
};

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
    
    document.addEventListener("mousemove", onMouseMove, {passive: true});
}
function onMouseUp(){
    document.removeEventListener("mousemove", onMouseMove);

}

document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);

canvas.addEventListener("click", e => {
    
    const x = e.x + offsetPoint.x;
    const y = e.y + offsetPoint.y;
    
    
    let unit = array.find(elem => checkPointInsideRectangle(elem.Point, {x: elem.Point.x + elem.size.width, y: elem.Point.y + elem.size.height}, {x,y}));
    
    
    activeBlock = unit;
    
});
