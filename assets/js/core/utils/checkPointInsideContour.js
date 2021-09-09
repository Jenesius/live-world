import Point from "../class/point-class";
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


export default checkPointInsideContour;





