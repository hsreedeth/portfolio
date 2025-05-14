let cubes = [];
const NUM_CUBES = 200;
const CUBE_SIZE = 12;
const SPACING_FACTOR = 2.5;
const RED_CUBE_SIZE_MULTIPLIER = 1.5;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed');

  angleMode(RADIANS);

  document.getElementById('refresh-icon').addEventListener('click', () => {
    regenerateCubes();
  });

  regenerateCubes(); // Show cubes on initial load
}

function regenerateCubes() {
    cubes = [];
  
    // Central red cube
    const redSize = CUBE_SIZE * RED_CUBE_SIZE_MULTIPLIER;
    cubes.push({
      x: 0,
      y: 0,
      z: 0,
      size: redSize,
      rotX: PI / 4,
      rotY: PI / 4,
      rotZ: 0,
      isRed: true
    });
  
    // Helper: check if two cubes overlap
    function cubesOverlap(c1, c2) {
      const minDist = (c1.size + c2.size) / 2;
      const dx = c1.x - c2.x;
      const dy = c1.y - c2.y;
      const dz = c1.z - c2.z;
      return sqrt(dx * dx + dy * dy + dz * dz) < minDist;
    }
  
    let attempts = 0;
    while (cubes.length < NUM_CUBES + 1 && attempts < NUM_CUBES * 20) {
      attempts++;
      let angle = random(TWO_PI);
      let radius = random(50, 150);
      let x = radius * cos(angle) * SPACING_FACTOR;
      let z = radius * sin(angle) * SPACING_FACTOR;
      let y = random(-30, 30) * SPACING_FACTOR;
      let size = CUBE_SIZE + random(-3, 3);
  
      const newCube = {
        x, y, z,
        size,
        rotX: random(TWO_PI),
        rotY: random(TWO_PI),
        rotZ: random(TWO_PI),
        isRed: false
      };
  
      let overlaps = cubes.some(c => cubesOverlap(c, newCube));
      if (!overlaps) {
        cubes.push(newCube);
      }
    }
  }

function draw() {
  background(0);

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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
