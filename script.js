// Define the zoom level
let zoomLevel = 3;
window.addEventListener('load',(e)=>{
    // document.getElementById('myCanvas').style.transform = `scale(${zoomLevel/2})`;
})
document.getElementById('zoom-in').addEventListener('click', zoomIn);
document.getElementById('zoom-out').addEventListener('click', zoomOut);
if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
        .then(permissionState => {
            if (permissionState === 'granted') {
                window.addEventListener('devicemotion', (e) => {
                    console.log('AccelarationX ', e.acceleration.x)
                    console.log('AccelarationY ', e.acceleration.y)
                    console.log('AccelarationZ ', e.acceleration.z)
                })
            } else {
                console.error('motion sensor access denied')
            }
        }).catch(console.error)
} else {
    console.error('Motion sensor not supported on this device')
}

function zoomIn() {
    // Increase the zoom level
    zoomLevel += 0.25;
    // Apply the zoom level to the content
    document.getElementById('myCanvas').classList.add('zoomed');
    document.getElementById('myCanvas').style.transform = `scale(${zoomLevel})`;
    console.log("zoom in ",zoomLevel)
}

function zoomOut() {
    // Decrease the zoom level
    if(zoomLevel - 0.1 >= 1) {
        zoomLevel -= 0.25;
        // Apply the zoom level to the myCanvas
        document.getElementById('myCanvas').classList.add('zoomed');
        document.getElementById('myCanvas').style.transform = `scale(${zoomLevel})`;
        console.log("zoom out ",zoomLevel)
    } 
};

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const image = new Image();
image.src = "SP1-2-floor-plan-5th-floor.jpg"; // Replace with your actual image URL

image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    centerImage();
};

let isDrawing = false;
let drawingPath = [];
let lastX = 0;
let lastY = 0;
let lineColor = "blue"; // Default line color
ctx.strokeStyle = lineColor; // Set default line color
ctx.lineJoin = "round";
// Set line width
const lineWidth = 15; // Adjust as needed

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    drawingPath = [{ x: e.offsetX, y: e.offsetY }];
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        drawingPath.push({ x: currentX, y: currentY });
        drawLine(lastX, lastY, currentX, currentY);
        lastX = currentX;
        lastY = currentY;
    }
});

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth; // Set line width
    ctx.stroke();
}
function drawLine2(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth; // Set line width
    ctx.stroke();
}
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    console.log(drawingPath);
    /*
    To implement the direction on the map we need to use
     (beginning)-> Where the user wants to move from.
      (via)-> [arrays of coordinates that the route is on]
     (End)-> The final destination of the user, either the name of the office or the number of the office.
    */
    //5520 - 5500
    drawLine2(1134, 474, 3678, 474);
    //Wrkst 5544-5545
    drawLine2(3678, 464, 3678, 720)
    //5525- wrkst 5545
    drawLine2(3678, 720, 1150, 720);
    //5541 - corridor C5001
    drawLine2(3200, 720, 4428, 1093)
    //5541 - corridor C5000
    drawLine2(3220, 720, 3084, 1232)
    //corridor C5002
    drawLine2(3515, 818, 3366, 1318)
    drawLine2(4175, 1021, 4029, 1533);
    //corridor C5000-C5110 to the back of 5208 and elevator 1-5PE7
    drawLine2(4029, 1533, 3862, 2099);
    //C5000 via Elevator lobby Elevator 4 - 11
    drawLine2(3805, 1474, 3628, 2036);
    //5580 - coorodor C5560
    drawLine2(1143, 1463, 2885, 1453);
    //closet 5404 via corridor C5400 via corridor C5405
    drawLine2(3021, 1461, 2918, 1847);
    //corridor C5405 
    drawLine2(2918, 1847, 3430, 1984);
    //corridor C5405 - C5100 via elevator 1-5PE7 corridor
    drawLine2(3430, 1984, 4123, 2182);
    //Junction of 5208,5108 corridor C5100
    drawLine2(4123, 2182, 4272, 1624)
    drawLine2(3084, 1232, 4274, 1618);
    drawLine2(4428, 1093, 4274, 1618)
    drawLine2(1142, 1200, 2888, 1199)
    drawLine2(2888, 1199, 2886, 1461);
    drawLine2(2886, 1461, 3023, 1461);
    drawLine2(3084, 1232, 3023, 1461)
});
// Function to draw the path on the canvas
function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    ctx.beginPath();
    ctx.moveTo(drawingPath[0].x, drawingPath[0].y); // Start from the first recorded position
    for (let i = 1; i < drawingPath.length; i++) {
        ctx.lineTo(drawingPath[i].x, drawingPath[i].y); // Draw line to each subsequent point
    }
    ctx.stroke();
}

const drawLineButton = document.getElementById("drawLine");
drawLineButton.addEventListener("click", () => {
    // Do something when the button is clicked
    console.log("Draw line button clicked");
});

// Rotate function for canvas
function rotateCanvas(degrees) {
    // Convert degrees to radians
    const radians = degrees * Math.PI / 180;

    // Calculate the center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save the current transformation matrix
    ctx.save();

    // Translate to the center of the canvas
    ctx.translate(centerX, centerY);

    // Rotate the canvas
    ctx.rotate(radians);

    // Draw the image
    ctx.drawImage(image, -image.width / 2, -image.height / 2); // Offset by half the image dimensions to center it

    // Restore the previous transformation matrix
    ctx.restore();
}



// Center the image inside the canvas
function centerImage() {
    const x = (canvas.width - image.width) / 2;
    const y = (canvas.height - image.height) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y);
}


//Viewport fidelity

function adjustViewport() {
    const currentScale = window.visualViewport.scale;

    // Check if the scale is greater than 1 (zoomed in)
    if (currentScale > 1) {
        // Prevent the browser from scaling beyond the initial scale
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
    } else {
        // Revert to default viewport settings
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
}

// Event listener to detect changes in visual viewport scale (e.g., zooming)
window.visualViewport.addEventListener('resize', adjustViewport);

// // Change line color
// // List of allowed colors
// const allowedColors = ['red', 'navy', 'orange', 'green'];

// // Function to generate a random color from the allowed colors
// function getRandomColor() {
//     return allowedColors[Math.floor(Math.random() * allowedColors.length)];
// }

// // Event listener for the button to randomize the line color
// document.getElementById('line-color').addEventListener('click', () => {
//     // Get a random color from the allowed colors
//     const randomColor = getRandomColor();
//     // Change the line color to the random color
//     changeLineColor(randomColor);
// });

// // Function to change the line color
// function changeLineColor(color) {
//     ctx.strokeStyle = color; // Set the canvas stroke style to the selected color
// }


// let rotateInterval;
// let rotateValue = 0;
// const rotationIncrement = 1; // Change the increment value as needed

// document.getElementById('rotate').addEventListener('click', () => {
//     // Start rotating the canvas when the button is held down
//     rotateInterval = setInterval(() => {
//         rotateCanvas(rotateValue += rotationIncrement);
//     }, 100); // Adjust the rotation speed as needed
// });

// document.getElementById('rotate').addEventListener('mouseup', () => {
//     // Stop rotating the canvas when the button is released
//     clearInterval(rotateInterval);
// });

// document.getElementById('rotate').addEventListener('mouseout', () => {
//     // Stop rotating the canvas when the mouse moves out of the button area
//     clearInterval(rotateInterval);
// });


// // Define the zoom level
// let zoomLevel = 1;

// // Get the canvas element
// const canvas = document.getElementById("myCanvas");
// const ctx = canvas.getContext("2d");
// const image = new Image();
// image.src = "SP1-2-floor-plan-5th-floor.jpg"; // Replace with your actual image URL

// // Initialize variables for motion tracking
// let x = canvas.width / 2;
// let y = canvas.height / 2;

// image.onload = function () {
//   canvas.width = image.width;
//   canvas.height = image.height;
//   ctx.drawImage(image, 0, 0);
// };

// Add event listener for devicemotion
if (typeof DeviceMotionEvent.requestPermission === "function") {
  DeviceMotionEvent.requestPermission()
    .then((permissionState) => {
      if (permissionState === "granted") {
        window.addEventListener("devicemotion", handleMotionEvent);
        window.alert('motion activated')
      } else {
        window.alert("Motion sensor access denied");
      }
    })
    .catch(console.error);
} else {
  console.error("Motion sensor not supported on this device");
}

// Function to handle motion events
function handleMotionEvent(event) {
  // Update position based on device acceleration
  x += event.accelerationIncludingGravity.x;
  y += event.accelerationIncludingGravity.y;
window.alert(event.accelerationIncludingGravity.x," : ", event.accelerationIncludingGravity.y)
  // Draw the updated position on the canvas
  drawPosition();
}

// Function to draw the user's current position on the canvas
function drawPosition() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background image
  ctx.drawImage(image, 0, 0);

  // Draw a circle at the current position
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}
