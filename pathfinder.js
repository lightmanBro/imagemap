const paths = [
    { name: "path1", coordinates: [{ x1: 1134, y1: 474, x2: 3678, y2: 474 }] },
    { name: "path2", coordinates: [{ x1: 3678, y1: 464, x2: 3678, y2: 720 }] },
    // Add more paths as needed
]


function findPathsToDestination(destinationX, destinationY, currentPath = {}, visitedPaths = [], allPaths = []) {
    if (!currentPath.hasOwnProperty('coordinates')) return []; // If currentPath doesn't have coordinates property, return an empty array

    visitedPaths.push(currentPath.name);

    const lastCoordinate = currentPath.coordinates[currentPath.coordinates.length - 1];

    if ((lastCoordinate.x1 === destinationX && lastCoordinate.y1 === destinationY) ||
        (lastCoordinate.x2 === destinationX && lastCoordinate.y2 === destinationY)) {
        // If the destination is reached, return the current path
        return [currentPath];
    }

    const nextPaths = allPaths.filter(path => {
        const lastCoordinatePath = path.coordinates[path.coordinates.length - 1];
        return (lastCoordinate.x2 === lastCoordinatePath.x1 && lastCoordinate.y2 === lastCoordinatePath.y1) ||
            (lastCoordinate.x2 === lastCoordinatePath.x2 && lastCoordinate.y2 === lastCoordinatePath.y2);
    });

    let connectedPaths = [];

    nextPaths.forEach(path => {
        if (!visitedPaths.includes(path.name)) {
            const connected = findPathsToDestination(destinationX, destinationY, path, [...visitedPaths], allPaths);
            connectedPaths = connectedPaths.concat(connected);
        }
    });

    return connectedPaths;
}


const destinationX = 3430;
const destinationY = 1984;
const currentPath = {}; // Provide an initial empty object for the current path
const visitedPaths = []; // Provide an initial empty array for visited paths
const pathsToConnect = findPathsToDestination(destinationX, destinationY, currentPath, visitedPaths, paths);
console.log("Paths to connect to the destination:");
console.log(pathsToConnect);
