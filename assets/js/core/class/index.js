import {canvas, ctx} from "./core/canvas";
import "./../css/index.css";


const randI = (min, max = min + (min = 0)) => (Math.random() * (max - min) + min) | 0;
const rand = (min, max = min + (min = 0)) => Math.random() * (max - min) + min;

const objects = [];
for (let i = 0; i < 100; i++) {
    objects.push({
        x: rand(canvas.width),
        y: rand(canvas.height),
        w: rand(40),
        h: rand(40),
        col: `rgb(${randI(255)},${randI(255)},${randI(255)})`,
    });
}

canvas.addEventListener("mousewheel", onmousewheel, false);
requestAnimationFrame(drawCanvas); // this will call drawcanvas after all other code has run

const view = (() => {
    const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
    var m = matrix; // alias for clear code
    var scale = 1; // current scale
    var ctx; // reference to the 2D context
    const pos = { x: 0, y: 0 }; // current position of origin
    var dirty = true;
    const API = {
        setContext(_ctx) { ctx = _ctx; dirty = true },
        apply() {
            if (dirty) { this.update() }
            ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
        },
        getScale() { return scale },
        getPosition() { return pos },
        setPosition(at){
            
            
            console.log(at.x, pos.x)
            
            pos.x = at.x - (at.x - pos.x) ;
            pos.y = at.y - (at.y - pos.y) ;
            
            this.update();
    
            dirty = true;
        },
        isDirty() { return dirty },
        update() {
            dirty = false;
            m[3] = m[0] = scale;
            m[2] = m[1] = 0;
            m[4] = pos.x;
            m[5] = pos.y;
        },
        scaleAt(at, amount) { // at in screen coords
            if (dirty) { this.update() }
            scale *= amount;
            pos.x = at.x - (at.x - pos.x) * amount;
            pos.y = at.y - (at.y - pos.y) * amount;
            dirty = true;
        },
    };
    return API;
})();

view.setContext(ctx);

function drawCanvas() {
    
    if (view.isDirty()) { // has the view changed, then draw all
        ctx.setTransform(1, 0, 0, 1, 0, 0); // default transform for clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        view.apply(); // set the 2D context transform to the view
        for (let i = 0; i < objects.length; i++) {
            var obj = objects[i];
            ctx.fillStyle = obj.col;
            ctx.fillRect(obj.x, obj.y, obj.h, obj.h);
        }
    }
    
    setTimeout(() => {
        requestAnimationFrame(drawCanvas);
    }, 1000/30);
    

}

function onmousewheel(e) {
    
    const x = e.offsetX;
    const y = e.offsetY;
    
    const delta = e.wheelDelta;
    
    if (delta > 0) view.scaleAt({x, y}, 1.1)
    else view.scaleAt({x, y}, 1 / 1.1)
    e.preventDefault();
}

canvas.addEventListener("mousedown", () => {
    
    canvas.addEventListener("mousemove", e => {
        
        view.setPosition({x: e.offsetX, y: e.offsetY})
        
        
    }, {passive: true})
    
})