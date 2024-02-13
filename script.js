document.getElementById('inpt-group-btn').style.bottom = `1.5rem`


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
    // alert('welcome to office map');
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
})
document.getElementById('zoom-in').addEventListener('pointerdown', zoomIn);
document.getElementById('zoom-out').addEventListener('pointerdown', zoomOut);

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
image.loading = 'eager';
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
    // Calculate the mouse position relative to the document
    lastX = e.clientX + window.scrollX;
    lastY = e.clientY + window.scrollY;
    drawingPath = [{ x: lastX, y: lastY }];
});

let x = 1134
let y = 474
let div = document.createElement('div')
div.textContent = 'office 204';
div.style.width = 100+'px'
div.style.height = 100+'px';
div.style.backgroundColor = 'orangered';
div.style.position = 'absolute';
div.style.left = x+'px'
div.style.top = y+'px';

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        // Calculate the mouse position relative to the document
        const currentX = e.clientX + window.scrollX;
        const currentY = e.clientY + window.scrollY;
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
    // canvas.parentNode.appendChild(div);
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
    //C5000 corridor
    drawLine2(3084, 1232, 4274, 1618);
    //5201 supply - 5203 corridor
    drawLine2(4428, 1093, 4274, 1618)
    //5554 pantry to 5560 corridor
    drawLine2(1142, 1200, 2888, 1199)
    //C5560 corridor
    drawLine2(2888, 1199, 2886, 1461);
    //C5560 corridor join comm rm, closet
    // drawLine2(4272, 1624, 3023, 1461);
    //5404 closet corridor
    //5209 - 5524 corridor 5405 5510
    drawLine2(4121.60000038147,2171.800003051758,3532,4321.199951171875);
    //5407-5424 corridor 5405 5510
    drawLine2(3414.400001525879,1991.5999755859375,2822,4126);
    //5307 - corridor 5405 5510
    drawLine2(2924,1853.5999755859375,2313,3988.5999755859375)
    //pantry 5020 - coom rm 15 CR-D corridor 5405 5510
    drawLine2(3868.400001525879, 2113.2000122070312,3270.400001525879,4253.800048828125);
    //Copy and print 5514 - 5612/5613 corridor C5610
    drawLine2(1144.400001525879,2755.800048828125,2671.400001525879,2752.800048828125);
    //Supply 5617-5626 corridor C5620
    drawLine2(1151,3035.5999755859375,2595,3037.5999755859375);
    //Corridor C5635
    drawLine2(1154.400001525879,3492,2463.400001525879,3496);
    //
    drawLine2(1164,3764.4000244140625,2374,3767.5999755859375);

    //
    drawLine2(1144.400001525879,2755.800048828125,1164,3764.4000244140625)
    //Corridor C5325,C5225,C5020
    drawLine2(2323,3988,3536, 4321.5999755859375);
});
let run = 0;
setInterval(() => {
    drawLine2(2900,6089,2992,6189.7998046875);
    // console.log(run+=1)
}, 2000);

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
