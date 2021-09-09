
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
    
    const container = document.getElementById("list-contours")
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
    })
    
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
    }

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



export {
    addContour,
    addPoint,
    removePoint,
    removePointFromContours,
    updateContour,
    points,
    contours
}


