export default (pointBegin, pointEnd) => {
    if (pointBegin.offsetX || pointEnd.offsetY) console.warn("Полученный элемент является эвентом, x и y могут быть нерентабельны, поскольку они не учитывают offset. Во избежании ошибки нужно использовать offsetX, offsetY")

    return Math.sqrt(Math.pow(pointEnd.x - pointBegin.x, 2) + Math.pow(pointEnd.y - pointBegin.y, 2));
}