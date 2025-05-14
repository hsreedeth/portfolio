let cubes = [];
const NUM_CUBES = 200;
const CUBE_SIZE = 12;
const SPACING_FACTOR = 2.5;
const RED_CUBE_SIZE_MULTIPLIER = 1.5;
let grainTexture;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed');

  angleMode(RADIANS);

  document.getElementById('refresh-icon').addEventListener('click', () => {
    regenerateCubes();
  });

  createGrain();
  regenerateCubes(); // ← call it here to show cubes on initial load
}

// function drawDottedLine(yPos, xStart, xEnd, gap = 10, dotSize = 2) {
//     for (let x = xStart; x <= xEnd; x += gap) {
//       push();
//       translate(x, yPos, 0);
//       noStroke();
//       fill(255, 80); // semi-transparent white
//       sphere(dotSize);
//       pop();
//     }
//   }
  

function regenerateCubes() {
  cubes = [];

  // Central red cube
  cubes.push({
    x: 0,
    y: 0,
    z: 0,
    size: CUBE_SIZE * RED_CUBE_SIZE_MULTIPLIER,
    rotX: PI / 4,
    rotY: PI / 4,
    rotZ: 0,
    isRed: true
  });


  // Surrounding white cubes
  for (let i = 0; i < NUM_CUBES; i++) {
    let angle = random(TWO_PI);
    let radius = random(50, 150);
    let x = radius * cos(angle) * SPACING_FACTOR;
    let z = radius * sin(angle) * SPACING_FACTOR;
    let y = random(-30, 30) * SPACING_FACTOR;

    cubes.push({
      x, y, z,
      size: CUBE_SIZE + random(-3, 3),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      isRed: false
    });
  }
}

function draw() {
  background(0);
//     // Determine horizontal spread of cubes (only non-central ones)
// let xValues = cubes.map(c => c.x);
// let minX = Math.min(...xValues);
// let maxX = Math.max(...xValues);

// // Draw the dotted line slightly above the cube cluster (e.g., y = -60)
// drawDottedLine(-60, minX, maxX);

  orbitControl(1, 1, 0);

  ambientLight(40);
  directionalLight(255, 100, 100, 0.5, -1, -0.5);
  pointLight(255, 0, 0, 0, 0, 0);   

  for (let cube of cubes) {
    push();
    translate(cube.x, cube.y, cube.z);
    rotateX(cube.rotX);
    rotateY(cube.rotY);
    rotateZ(cube.rotZ);
    noStroke();
    fill(cube.isRed ? color(255, 0, 0) : 255);
    box(cube.size);
    pop();

    cube.rotY += 0.001;
    cube.rotX += 0.0005;
  }

  // Grain overlay
  push();
  resetMatrix();
  translate(-width / 2, -height / 2, 1);
  image(grainTexture, 0, 0, width, height);
  pop();
}

function createGrain() {
  grainTexture = createGraphics(width, height);
  grainTexture.loadPixels();
  for (let i = 0; i < width * height * 0.1; i++) {
    let x = floor(random(width));
    let y = floor(random(height));
    let idx = (y * width + x) * 4;
    let g = random(255);
    grainTexture.pixels[idx] = g;
    grainTexture.pixels[idx + 1] = g;
    grainTexture.pixels[idx + 2] = g;
    grainTexture.pixels[idx + 3] = random(30, 90);
  }
  grainTexture.updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createGrain();
}
