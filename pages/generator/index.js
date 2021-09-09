import {canvas} from "../../assets/js/core/canvas";
import View from "../../assets/js/core/view";
import Point from "../../assets/js/core/class/point-class";
import "./index.css"
import distanceBetweenPoints from "../../assets/js/core/utils/distanceBetweenPoints";

import {addPoint, addContour, points, removePoint, contours} from "./assets/js/store";
import checkPointInsideContour from "../../assets/js/core/utils/checkPointInsideContour";

const view = new View(canvas);
view.lockMove();

const state = {
    modePoint: "add" // add, select or null
}

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
]

function generateFunctionalPanel(){
    
    function update(){
    
        array.forEach(elem => {
            
            if (elem.isActive()) elem.container.classList.add("active");
            else elem.container.classList.remove("active");
            
        })
    
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
            
        })
        
        
        return div;
    })
    
    c.append(...nodes);
    
    update();
    
}

generateFunctionalPanel()


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
    })
    
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

    Object.values(contours).forEach(contour => drawContour(contour.array, {color: contour.color}))
    
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
const arrayPathStore = new Proxy([], {
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
    
})
