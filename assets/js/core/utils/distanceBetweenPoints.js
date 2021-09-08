export default (pointBegin, pointEnd) => {
    return Math.sqrt(Math.pow(pointEnd.x - pointBegin.x, 2) + Math.pow(pointEnd.y - pointBegin.y, 2));
}