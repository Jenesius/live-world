import {ctx} from "./canvas";

export default function draw(){
    /**Draw first country*/
    
    ctx.fillStyle = "#272727"
    ctx.fillRect(0,0, 800, 600);
    
    ctx.fillStyle = "#754c4c"
    ctx.fillRect(0, 0, 100, 100);
    
    /**
     * Draw second country
     * */
    
    ctx.fillRect(200, 200, 100, 100);
    
}