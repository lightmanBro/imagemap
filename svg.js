const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

// console.log(graphs);
const coordinatesElement = document.querySelector(".coordinates");
let start, end;
let graph;
let shortestRoute;
const allKeys = [];

output.forEach((office) => {
    Object.keys(office).forEach((k) => {
        document
            .querySelector(".offices")
            .insertAdjacentHTML("afterbegin", `<button>${k}</button>`);
    })
})

document.querySelectorAll('.number').forEach(number => {
    number.addEventListener('click', () => {
        // console.log('number clicked')
      // Copy the content of the clicked element to the clipboard
      const textToCopy = number.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Change the background color of the element after it has been copied
        number.style.backgroundColor = 'yellow';
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    });
  });
// console.log(output, graphs);
function getOffices(startPoint, endPoint) {
    let startAxis, endAxis;
    try {
        // Iterate over each office object
        output.forEach((office) => {
            const keys = Object.keys(office);
            
            // Extract office key and coordinates for start point
            if (office.hasOwnProperty(startPoint)) {
                // console.log("Office Startpoint Key:", startPoint);
                const { x, y } = office[startPoint].coordinates;
                startAxis = office[startPoint].axis;
                start = [x, y];
                // console.log("Coordinates:", start, startAxis);
            }
            // Extract office key and coordinates for end point
            if (office.hasOwnProperty(endPoint)) {
                // console.log("Office Endpoint Key:", endPoint);
                const { x, y } = office[endPoint].coordinates;
                endAxis = office[endPoint].axis;
                end = [x, y];
                // console.log("Coordinates:", end, endAxis);
            }
        });
        //Find the line that has the start and end offices mapped to it.
        //Use the values found to be the start and end line which will be used to get the appropiate route.
        if (startAxis && endAxis) {
            shortestRoute = findShortestRoute(graphs, startAxis, endAxis);
            pointToRoutes(shortestRoute);
            pointToPoint(svg, start, end);
            console.log(shortestRoute[shortestRoute.length-1],start);
            window.scrollTo({
                top: shortestRoute[shortestRoute.length-1][0],
                left: shortestRoute[shortestRoute.length-1][1],
                behavior: 'smooth'
            })
        } else {
            pointToPoint(svg, start, end);
            coordinatesElement.classList.add("show");
            setTimeout(() => {
                coordinatesElement.classList.remove("show");
            }, 3000);
        }
        // console.log("Coordinates:", graph, start, end, shortestRoute);
    } catch (error) {
        // console.log(error);
    }
}

function findRoute() {
    const startPoint = document.getElementById("from").value.trim();
    const endPoint = document.getElementById("to").value.trim();
    if (startPoint && endPoint) {
        getOffices(startPoint, endPoint);
    } else {
        drawLine2(startPoint || endPoint);
        coordinatesElement.classList.add("show");
        coordinatesElement.innerHTML =
            "Please provide both start point and destination.";
        setTimeout(() => {
            coordinatesElement.classList.remove("show");
        }, 3000);
    }
}
function pointToRoutes(shortestRoute) {
    shortestRoute.forEach((segment) => {
        const [x1, y1, x2, y2] = segment;
        drawLine(x1, y1, x2, y2);
    });
}
// Set the SVG width and height attributes
const svg = document.querySelector("svg");
const image = document.querySelector("image");
// image.setAttribute('width', '5400');
// image.setAttribute('height', '7200')
window.addEventListener("DOMContentLoaded", (e) => {
    
    if (
        "ontouchstart" in window ||
        navigator.maxTouchPoints
    ) {
        svg.setAttribute("width", "5400");
        svg.setAttribute("height", "7200");
        image.setAttribute('width', '100%');
        image.setAttribute('height', '100%');

        // Optionally add preserveAspectRatio for the image
          image.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    } else {
        svg.setAttribute("width", `${window.innerWidth}px`);
        svg.setAttribute("height", "7200px");
    }

});

const lineColor = "#1b88fceb"; // Default line color
const lineWidth = 25; // Adjust as needed
const drawingPath = [];
let startPoint = {};

function drawLine(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", lineColor);
    line.setAttribute("stroke-width", lineWidth);
    svg.appendChild(line);
    return line;
}


document.getElementById("drawLine").addEventListener("click", () => {
    const lines = Array.from(svg.querySelectorAll('line')); // Convert NodeList to array
    lines.forEach(line => line.remove()); // Remove each line element
    // Clear icons and text
    const icons = svg.querySelectorAll('g');
    if (icons) {
        icons.forEach(icon => svg.removeChild(icon)); // Remove all icons
    }

    const texts = svg.querySelectorAll('text');
    if (texts) {
        texts.forEach(text => svg.removeChild(text)); // Remove all text elements
    }
    findRoute();
    setTimeout(() => {
        document.getElementById('from').value = ''
        document.getElementById('to').value = ''
    }, 500);
});


let zoomLevel = 1;
document.getElementById("zoom-in").addEventListener("pointerdown", zoomIn);
document.getElementById("zoom-out").addEventListener("pointerdown", zoomOut);

function zoomIn() {
    // Increase the zoom level
    zoomLevel += 0.25;
    // Apply the zoom level to the content
    document.querySelector("svg").classList.add("zoomed");
    document.querySelector("svg").style.transform = `scale(${zoomLevel})`;
}

function zoomOut() {
    // Decrease the zoom level
    if (zoomLevel - 0.1 >= 1) {
        zoomLevel -= 0.25;
        // Apply the zoom to the svg
        document.querySelector("svg").classList.add("zoomed");
        document.querySelector("svg").style.transform = `scale(${zoomLevel})`;
    }
}

// Adjust viewport settings
function adjustViewport() {
    const currentScale = window.visualViewport.scale;
    // Check if the scale is greater than 1 (zoomed in)
    if (currentScale > 1) {
        // Prevent the browser from scaling beyond the initial scale
        document
            .querySelector('meta[name="viewport"]')
            .setAttribute(
                "content",
                "width=device-width, initial-scale=1.0, maximum-scale=1.0"
            );
    } else {
        // Revert to default viewport settings
        document
            .querySelector('meta[name="viewport"]')
            .setAttribute(
                "content",
                "width=device-width, initial-scale=1.0"
            );
    }
}

// Event listener to detect changes in visual viewport scale (e.g., zooming)
window.visualViewport.addEventListener("resize", adjustViewport);

// Define the graph as an array of line segments [x1, y1, x2, y2]
function arePointsEqual(point1, point2, tolerance = 0.001) {
    let [x1, y1] = Array.isArray(point1) ? point1 : [point1.x, point1.y];
    let [x2, y2] = Array.isArray(point2) ? point2 : [point2.x, point2.y];

    return Math.abs(x1 - x2) < tolerance && Math.abs(y1 - y2) < tolerance;
}

function findShortestRoute(graph, start, end) {
    const visited = new Set();
    const queue = [[start, []]]; // Queue of [currentPoint, route]

    while (queue.length > 0) {
        const [currentPoint, route] = queue.shift();
        visited.add(JSON.stringify(currentPoint));

        for (const segment of graph) {
            const [x1, y1, x2, y2] = segment;
            const nextPoint1 = [x1, y1];
            const nextPoint2 = [x2, y2];
            if (
                arePointsEqual(nextPoint1, currentPoint) &&
                !visited.has(JSON.stringify(nextPoint2))
            ) {
                const newRoute = [...route, segment];
                if (arePointsEqual(nextPoint2, end)) {
                    return newRoute; // Reached the end point
                }
                queue.push([nextPoint2, newRoute]);
                visited.add(JSON.stringify(nextPoint2));
            }
            if (
                arePointsEqual(nextPoint2, currentPoint) &&
                !visited.has(JSON.stringify(nextPoint1))
            ) {
                const newRoute = [...route, segment];
                if (arePointsEqual(nextPoint1, end)) {
                    return newRoute; // Reached the end point
                }
                queue.push([nextPoint1, newRoute]);
                visited.add(JSON.stringify(nextPoint1));
            }
        }
    }

    return []; // No path found to end point
}

// Function to draw map location icon with animation
function drawLocationIcon(svg, x, y) {
    const iconGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Map pin shape using path
    const pinPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const pinRadius = 150; // Radius of the circular part of the pin
    const pinHeight = 70; // Total height of the pin
    const pinPathData = `
        M ${x} ${y} 
        C ${x - pinRadius} ${y - pinRadius}, ${x + pinRadius} ${y - pinRadius}, ${x} ${y} 
        L ${x} ${y + pinHeight} 
        Q ${x - 10} ${y + pinHeight - 10}, ${x} ${y + pinHeight + 10} 
        Q ${x + 10} ${y + pinHeight - 10}, ${x} ${y + pinHeight} 
        Z
    `;
    pinPath.setAttribute("d", pinPathData);
    pinPath.setAttribute("fill", "red");

    // Add bounce animation to the pin
    const animateBounce = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
    animateBounce.setAttribute("attributeName", "transform");
    animateBounce.setAttribute("attributeType", "XML");
    animateBounce.setAttribute("type", "translate");
    animateBounce.setAttribute("values", `0,-10; 0,0; 0,-5; 0,0`); // Creates a bouncing effect
    animateBounce.setAttribute("dur", "1.5s");
    animateBounce.setAttribute("repeatCount", "indefinite");

    pinPath.appendChild(animateBounce);

    iconGroup.appendChild(pinPath);

    svg.appendChild(iconGroup);
}

// Function to draw text on icon with animation
function drawTextOnIcon(svg, x, y, text) {
    const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.setAttribute("x", x);
    textElement.setAttribute("y", y - 40); // Adjust vertical position of text above the icon
    textElement.setAttribute("fill", "black");
    textElement.setAttribute("font-family", "Arial, sans-serif");
    textElement.setAttribute("font-weight", "bold");
    textElement.setAttribute("font-size", "50"); // Smaller font size
    textElement.setAttribute("text-anchor", "middle");
    textElement.textContent = text;

    // Add fade-in animation to the text
    const animateFade = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animateFade.setAttribute("attributeName", "opacity");
    animateFade.setAttribute("from", "0");
    animateFade.setAttribute("to", "1");
    animateFade.setAttribute("dur", "2s");
    animateFade.setAttribute("fill", "freeze"); // Stays at 'to' value after animation ends

    textElement.appendChild(animateFade);

    svg.appendChild(textElement);
}


// Function to draw point to point
function pointToPoint(svg, start, end) {
    // Draw location icon at start point
    const [x1, y1] = start;
    drawLocationIcon(svg, x1, y1);
    drawTextOnIcon(svg, x1, y1, "Start"); // Display start text

    // Draw location icon at end point
    const [x2, y2] = end;
    drawLocationIcon(svg, x2, y2);
    drawTextOnIcon(svg, x2, y2, "End"); // Display end text
}
/*
for(initialization; condition; iteration) {
    statement
}
*/