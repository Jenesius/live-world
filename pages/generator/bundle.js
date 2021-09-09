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

canvas.getContext("2d");

/*
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 */
canvas.width = 800;
canvas.height = 600;



document.body.style.backgroundColor = "rgba(29,28,28,0.86)";

class View{
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
        };
        
        const self = this;
        
        function onMouseMove(e){
            self.moving = true;

            self.offset = new Point(
                Math.max(self.offset.x + prevPoint.x - e.x, self.LIMIT_MIN_X),
                Math.max(self.offset.y + prevPoint.y- e.y, self.LIMIT_MIN_Y)
            );
        
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

            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("mouseleave", onMouseLeave);
            canvas.removeEventListener("mouseup", onMouseLeave);
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

var distanceBetweenPoints = (pointBegin, pointEnd) => {
    if (pointBegin.offsetX || pointEnd.offsetY) console.warn("Полученный элемент является эвентом, x и y могут быть нерентабельны, поскольку они не учитывают offset. Во избежании ошибки нужно использовать offsetX, offsetY");

    return Math.sqrt(Math.pow(pointEnd.x - pointBegin.x, 2) + Math.pow(pointEnd.y - pointBegin.y, 2));
};

const points = new Proxy([], {
    set(obj, proxy, value) {
        obj[proxy] = value;
        return true;
    }
});

function addPoint(point){
    points.push(point);
}
function removePoint(point){
    let index = points.indexOf(point);
    if (index === -1) return console.warn(`Точки ${point} нет в хранилище.`);
    
    removePointFromContours(point);
    
    points.splice(index, 1);
}

function onUpdateContours(){
    
    const container = document.getElementById("list-contours");
    container.innerHTML = '';
    
    const nodes = Object.values(contours).map(contour => {
        
        const div = document.createElement("div");
        div.style.backgroundColor = contour.color;
        
        const p = document.createElement("p");
        p.innerText = String(contour.id);
        
        const image = document.createElement("i");
        image.classList.add("fi-rr-cross-small");
        
        image.addEventListener("click", () => removeContour(contour.id));
        
        div.append(p, image);
        
        return div;
    });
    
    container.append(...nodes);
    
}

const contours  = new Proxy({}, {
    set(obj, prop, value) {
    
        obj[prop] = value;
        
        onUpdateContours();
        
        return true;
    },
    deleteProperty(object, prop) {
        delete object[prop];
        
        onUpdateContours();
        
        
        return true;
    }
});

let contourId = 0;
function addContour(array){
    function getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    const object = {
        array,
        color: getRandomColor() + "35",
        id: contourId++
    };

    contours[object.id] = object;
}

function removeContour(id){
    delete contours[id];
}

function updateContour(contourId, array) {
    
    if (!contours[contourId]) return console.warn("Не можем найти pathObject с id:", contourId);
    
    //Array is short, remove pathObject
    if (array.length < 3) {
        removeContour(contourId);
        return console.warn("Контур удалён, т.к. количество элементов в нём меньше чере 3");
    }
    //Обновили путь
    contours[contourId].array = array;
}

function removePointFromContours(point){
    

    for(let contourId in contours) {
        const contour = contours[contourId];
    
        if (!contour.array.includes(point)) continue;
    
    
        updateContour(contourId, contour.array.filter(item => item !== point));
    }

    
}

function checkPointInsideContour (point, arrayPoints) {

    const q_patt = [[0, 1], [3, 2]];
    
    if (arrayPoints.length < 3) return false;
    
    let pred_pt = new Point(arrayPoints[arrayPoints.length - 1]);
    
    pred_pt.x -= point.x;
    pred_pt.y -= point.y;
    
    let pred_q = q_patt[pred_pt.y<=0?1:0][pred_pt.x<=0?1:0];
    
    let w = 0;
    
    for(let i =0; i < arrayPoints.length; ++i) {
        let cur_pt = new Point(arrayPoints[i]);
        
        cur_pt.x -= point.x;
        cur_pt.y -= point.y;
    
        let q=q_patt[cur_pt.y<=0?1:0][cur_pt.x<=0?1:0];
        switch (q-pred_q)
        {
            case -3:++w;break;
            case 3:--w;break;
            case -2:if(pred_pt.x*cur_pt.y>pred_pt.y*cur_pt.x) ++w;break;
            case 2:if(!(pred_pt.x*cur_pt.y>pred_pt.y*cur_pt.x)) --w;break;
        }
        pred_pt = cur_pt;
        pred_q = q;
    }
    return w!==0;
}

const view = new View(canvas);
view.lockMove();

const state = {
    modePoint: "add" // add, select or null
};

const array = [
    {
        icon: "lock",
        onclick: () => {
            if (view.isLockMove) return view.unlockMove();
            
            view.lockMove();
        },
        isActive: () => view.isLockMove
    },
    {
        icon: "cursor",
        onclick: () => {
            state.modePoint = null;
        },
        isActive: () => state.modePoint === null
    },
    {
        icon: "cursor-plus",
        onclick: () => {
            const name = "add";
            if (state.modePoint !== name) return state.modePoint = name;
            
            state.modePoint = null;
        },
        isActive: () => state.modePoint === "add"
    },
    {
        icon: "interactive",
        onclick: () => {
            const name = "select";
            if (state.modePoint !== name) return state.modePoint = name;
    
            state.modePoint = null;
        },
        isActive: () => state.modePoint === "select"
    },
    {
        icon: "tool-marquee",
        onclick: () => {
            const name = "select-contour";
    
            if (state.modePoint !== name) return state.modePoint = name;
    
            state.modePoint = null;
        },
        isActive: () => state.modePoint === "select-contour"
    }
];

function generateFunctionalPanel(){
    
    function update(){
    
        array.forEach(elem => {
            
            if (elem.isActive()) elem.container.classList.add("active");
            else elem.container.classList.remove("active");
            
        });
    
    }
    
    const c = document.getElementById("function-panel"); // Container for append
    
    //Generating array of cell
    const nodes = array.map(cell => {
        const div = document.createElement("div");
        const icon = document.createElement("i");
        icon.classList.add("fi-rr-" + cell.icon);
        
        div.appendChild(icon);
        
        cell.container = div;
        
        if (cell.onclick) div.addEventListener("click", () => {
            cell.onclick();
            
            update();
            
        });
        
        
        return div;
    });
    
    c.append(...nodes);
    
    update();
    
}

generateFunctionalPanel();


function draw() {
    
    const ctx = view.ctx;
    
    ctx.fillStyle = "#2e2d2d";
    ctx.fillRect(0, 0, 800, 600);
    
    ctx.strokeStyle = "white";

    ctx.lineWidth = 1;
    ctx.beginPath();       // Начинает новый путь
    
    ctx.moveTo(-view.offset.x, -view.offset.y);
    ctx.lineTo(-view.offset.x, -view.offset.y+600);
    ctx.moveTo(-view.offset.x, -view.offset.y);
    ctx.lineTo(-view.offset.x + 800, -view.offset.y);
    ctx.stroke();
    
    ctx.fillStyle = "red";
    ctx.fillRect(50 - view.offset.x, 50 - view.offset.y, 50, 50);
    
    
    
    points.forEach(item => {
        ctx.fillStyle = "blue";
        ctx.fillRect(item.x - view.offset.x, item.y - view.offset.y, 3, 3);
    });
    
    function drawContour(array, {color = "red", width = 1} = {}) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        for(let i = 0;i < array.length; i ++) {
        
            let nextIndex = (array.length - 1 === i)? 0: i+1;
        
            const beginPoint = array[i];
            const endPoint   = array[nextIndex];
        
            ctx.beginPath();

            ctx.moveTo(beginPoint.x - view.offset.x, beginPoint.y - view.offset.y);
            ctx.lineTo(endPoint.x - view.offset.x, endPoint.y - view.offset.y);
            ctx.stroke();
            ctx.closePath();
        
        }
    
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
    }
    
    drawContour(newArrayPath);

    Object.values(contours).forEach(contour => drawContour(contour.array, {color: contour.color}));
    
    if (selectedContour)
    drawContour(selectedContour.array, {color: selectedContour.color, width: 4});
    
    if (selectedPoint) {

        ctx.strokeStyle = "yellow";
        ctx.strokeRect(selectedPoint.x - view.offset.x - 3, selectedPoint.y - view.offset.y - 3,9, 9);
    }
    
}
setInterval(draw, 1000 / 60);



let selectedPoint = null;
let selectedContour = null;

let newArrayPath = [];
new Proxy([], {
    set: (obj, prop, value) => {
        
        console.log("store add:",value);
        
        obj[prop] = value;
        return true;
    }
});

function onPoint(e){
    
    if (view.moving) return; //Если карта является в режиме перемещения - отменяем операцию
    
    if (state.modePoint === "select") {
        
        const alt = 10;
        const clickedPoint = points.find(point => distanceBetweenPoints({x: e.offsetX + view.offset.x, y: e.offsetY + view.offset.y}, point) < alt);
        
        if (!clickedPoint) return;
        
        
        /**
         * Через Ctrl -> устанавливаем связь
         * */
        
        if(e.ctrlKey) {
            
            const indexOfCurrent = newArrayPath.indexOf(selectedPoint);
            
            if (indexOfCurrent === -1 && selectedPoint !== null) {
                newArrayPath.push(selectedPoint);
            }

        
            if (newArrayPath.indexOf(clickedPoint) !== -1) {
                addContour(newArrayPath);
                
                selectedPoint = null;
                
                return newArrayPath = [];
                
            }
            newArrayPath.push(clickedPoint);
        }
        else {
            newArrayPath = [];
        }
    
        
        
        selectedPoint = clickedPoint;
        return ;
    }
    
    if (state.modePoint === "add") {
        const point = new Point(e.offsetX + view.offset.x, e.offsetY + view.offset.y);
        if (point.x < 0 || point.y <0) return;
    
        return addPoint(point);
    }
    
    if (state.modePoint === "select-contour") {
    
        const point = new Point(e.offsetX + view.offset.x, e.offsetY + view.offset.y);
        
        let contour = Object.values(contours).find(contour => checkPointInsideContour(point, contour.array));
        
        selectedContour = (contour !== undefined)? contour : null;
        
    }
    

    
}

canvas.addEventListener("mouseup", onPoint);

document.addEventListener("keyup", e => {
    
    if (e.key === "Delete") {
        
        if (selectedPoint) {
            
            removePoint(selectedPoint);
            
            selectedPoint = null;
            
        }
        
    }
    
});
