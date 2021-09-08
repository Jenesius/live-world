import Size from "../class/size-class";
import Point from "../class/point-class";

const array = [];

array.push({
    id: "1",
    Point: new Point(50, 50),
    size: new Size(50, 50),
    fill: "red"
})

array.push({
    id: "2",
    Point: new Point(100, 50),
    size: new Size(50, 50),
    fill: "green"
})

array.push({
    id: "3",
    Point: new Point(150, 50),
    size: new Size(50, 50),
    fill: "blue"
})

array.push({
    id: "4",
    Point: new Point(50, 150),
    size: new Size(50, 50),
    fill: "yellow"
})

array.push({
    id: "5",
    Point: new Point(450, 550),
    size: new Size(50, 50),
    fill: "gray"
})

array.push({
    id: "6",
    Point: new Point(450, 650),
    size: new Size(50, 50),
    fill: "pink"
})

array.push({
    id: "7",
    Point: new Point(500, 450),
    size: new Size(50, 50),
    fill: "yellow"
})
array.push({
    id: "8",
    Point: new Point(800, 850),
    size: new Size(50, 50),
    fill: "red"
})
export {
    array
}