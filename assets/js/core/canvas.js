import state from "./state";
import draw from "./draw";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

/*
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 */
canvas.width = 800;
canvas.height = 600;

document.body.appendChild(canvas);

document.body.style.backgroundColor = "rgba(29,28,28,0.86)";
/*
document.addEventListener('wheel', e => {
    const scaleMultiplier = 0.1;
    if (e.deltaY > 0){
        state.zoom += scaleMultiplier;
    } else {

        state.zoom -= scaleMultiplier;
    }
    ctx.scale(state.zoom, state.zoom);
    
    
});
*/


export {
    ctx,
    canvas
}

