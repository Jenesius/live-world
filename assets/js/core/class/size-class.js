export default class Size{
    
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