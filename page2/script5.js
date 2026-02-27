let font;
let points = [];
let particles = [];
let overload = 0;

let fontSize = 150;
let msg = "PAST";

function preload() {
  font = loadFont("ArchivoBlack-Regular.ttf");
}

function setup() {
  createCanvas(600, 600);

  points = font.textToPoints(msg, 50, 360, fontSize, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });

  for (let i = 0; i < points.length; i++) {
    particles.push({
      x: points[i].x,
      y: points[i].y,
      dx: 0,
      dy: 0,
      ax: random(-1, 1),
      ay: random(-1, 0)
    });
  }
}

function draw() {

 
  background(232, 220, 192);

  if (mouseIsPressed) {
    overload += 0.6;
  } else {
    overload = max(0, overload - 0.6);
  }

  noStroke();

  
  fill(70, 50, 30, 200);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    if (mouseIsPressed) {
      let s = overload * 0.01;

      p.dx += p.ax * s;
      p.dy += p.ay * s;

      p.dx *= 0.995;
      p.dy *= 0.995;
    } else {
      p.dx *= 0.90;
      p.dy *= 0.90;
    }

    ellipse(p.x + p.dx, p.y + p.dy, 3);
  }
}