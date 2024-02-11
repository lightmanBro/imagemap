document.getElementById('inpt-group-btn').addEventListener('click',(e)=>{
    document.getElementById('inpt-group').classList.toggle('none')
    document.getElementById('inpt-group').style.transition = `transform 0.5s ease`;
    if(document.getElementById('inpt-group').classList.contains('none')){
        document.getElementById('inpt-group-btn').innerHTML = '<span class="material-symbols-outlined"> keyboard </span>'
        document.getElementById('inpt-group-btn').style.bottom = `1rem`
    }else{
        document.getElementById('inpt-group-btn').innerHTML = '<span class="material-symbols-outlined">\
        keyboard_hide\
        </span>';
        document.getElementById('inpt-group-btn').style.bottom = `12rem`
    }
})


let zoomLevel = 3;
window.addEventListener('load',(e)=>{
    // document.getElementById('myCanvas').style.transform = `scale(${zoomLevel/2})`;
})
document.getElementById('zoom-in').addEventListener('pointerdown', zoomIn);
document.getElementById('zoom-out').addEventListener('pointerdown', zoomOut);
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
    document.getElementById('header').classList.add('none');
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
        if(zoomLevel == 1){
            setTimeout(() => {
                document.getElementById('header').classList.remove('none')
            }, 500);
        }
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

// Define the drawLine function to draw a line between two points with animation
function drawLine(x1, y1, x2, y2) {
    let start = null;
    const duration = 2000; // Duration of the animation in milliseconds
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        // Calculate the current position of the line
        const currentX = x1 + (x2 - x1) * (progress / duration);
        const currentY = y1 + (y2 - y1) * (progress / duration);
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw the image or any other content if needed
        ctx.drawImage(image, 0, 0);
        
        // Draw the line up to the current position
        drawLine2(x1, y1, currentX, currentY);
        
        // Continue the animation until the duration is reached
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    // Start the animation
    requestAnimationFrame(animate);
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

    const coordinates = [
        { x1: 1134, y1: 474, x2: 3678, y2: 474 }, // 5520 - 5500
        { x1: 3678, y1: 464, x2: 3678, y2: 720 }, // Wrkst 5544-5545
        { x1: 3678, y1: 720, x2: 1150, y2: 720 }, // 5525- wrkst 5545
        { x1: 3200, y1: 720, x2: 4428, y2: 1093 }, // 5541 - corridor C5001
        { x1: 3220, y1: 720, x2: 3084, y2: 1232 }, // 5541 - corridor C5000
        { x1: 3515, y1: 818, x2: 3366, y2: 1318 }, // corridor C5002
        { x1: 4175, y1: 1021, x2: 4029, y2: 1533 }, // corridor C5002
        { x1: 4029, y1: 1533, x2: 3862, y2: 2099 }, // corridor C5000-C5110 to the back of 5208 and elevator 1-5PE7
        { x1: 3805, y1: 1474, x2: 3628, y2: 2036 }, // C5000 via Elevator lobby Elevator 4 - 11
        { x1: 1143, y1: 1463, x2: 2885, y2: 1453 }, // 5580 - coorodor C5560
        { x1: 3021, y1: 1461, x2: 2918, y2: 1847 }, // closet 5404 via corridor C5400 via corridor C5405
        { x1: 2918, y1: 1847, x2: 3430, y2: 1984 }, // corridor C5405
        { x1: 3430, y1: 1984, x2: 4123, y2: 2182 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
        { x1: 4123, y1: 2182, x2: 4272, y2: 1624 }, // Junction of 5208,5108 corridor C5100
        { x1: 3084, y1: 1232, x2: 4274, y2: 1618 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
        { x1: 4428, y1: 1093, x2: 4274, y2: 1618 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
        { x1: 1142, y1: 1200, x2: 2888, y2: 1199 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
        { x1: 2888, y1: 1199, x2: 2886, y2: 1461 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
        { x1: 2886, y1: 1461, x2: 3023, y2: 1461 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
        { x1: 3084, y1: 1232, x2: 3023, y2: 1461 } // corridor C5405 - C5100 via elevator 1-5PE7 corridor
    ];
    
    for (let i = 0; i < coordinates.length; i++) {
        setTimeout(() => {
            const coord = coordinates[i];
            drawLine2(coord.x1, coord.y1, coord.x2, coord.y2);
        }, i * 1000); // Delay in milliseconds, e.g., 1000ms = 1 second
    }
    


    /*
    To implement the direction on the map we need to use
     (beginning)-> Where the user wants to move from.
      (via)-> [arrays of coordinates that the route is on]
     (End)-> The final destination of the user, either the name of the office or the number of the office.
    */
    // //5520 - 5500
    // drawLine2(1134, 474, 3678, 474);
    // //Wrkst 5544-5545
    // drawLine2(3678, 464, 3678, 720)
    // //5525- wrkst 5545
    // drawLine2(3678, 720, 1150, 720);
    // //5541 - corridor C5001
    // drawLine2(3200, 720, 4428, 1093)
    // //5541 - corridor C5000
    // drawLine2(3220, 720, 3084, 1232)
    // //corridor C5002
    // drawLine2(3515, 818, 3366, 1318)
    // drawLine2(4175, 1021, 4029, 1533);
    // //corridor C5000-C5110 to the back of 5208 and elevator 1-5PE7
    // drawLine2(4029, 1533, 3862, 2099);
    // //C5000 via Elevator lobby Elevator 4 - 11
    // drawLine2(3805, 1474, 3628, 2036);
    // //5580 - coorodor C5560
    // drawLine2(1143, 1463, 2885, 1453);
    // //closet 5404 via corridor C5400 via corridor C5405
    // drawLine2(3021, 1461, 2918, 1847);
    // //corridor C5405 
    // drawLine2(2918, 1847, 3430, 1984);
    // //corridor C5405 - C5100 via elevator 1-5PE7 corridor
    // drawLine2(3430, 1984, 4123, 2182);
    // //Junction of 5208,5108 corridor C5100
    // drawLine2(4123, 2182, 4272, 1624)
    // drawLine2(3084, 1232, 4274, 1618);
    // drawLine2(4428, 1093, 4274, 1618)
    // drawLine2(1142, 1200, 2888, 1199)
    // drawLine2(2888, 1199, 2886, 1461);
    // drawLine2(2886, 1461, 3023, 1461);
    // drawLine2(3084, 1232, 3023, 1461)
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

function drawCoordinate(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
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
        document.getElementById('header').classList.add('none')
    } else {
        // Revert to default viewport settings
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
    }
}

// Event listener to detect changes in visual viewport scale (e.g., zooming)
window.visualViewport.addEventListener('resize', adjustViewport);


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
