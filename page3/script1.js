let video;

//变量区
let gameState = "idle"; 
let score = 0;
let misses = 0;
let timeLeft = 30;
let lastSecond = 0;

let startButton;
let resetButton;
let infoText;

//异常区域阈值
let anomaly = {
  x: 0,
  y: 0,
  w: 140,
  h: 140,
  type: 0,
  active: false
};


//创建窗口
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  createUI();
  textFont("Arial");
}

//游戏的框架和ui建构
function createUI() {
  infoText = createP("Anomaly Camera // Find the strange part and click to repair it");
  infoText.position(20, 10);
  infoText.style("color", "white");
  infoText.style("font-size", "18px");
  infoText.style("margin", "0");

  startButton = createButton("Start Scan");
  startButton.position(20, 50);
  startButton.mousePressed(startGame);

  resetButton = createButton("Reset");
  resetButton.position(110, 50);
  resetButton.mousePressed(resetGame);
}

function startGame() {
  score = 0;
  misses = 0;
  timeLeft = 30;
  gameState = "playing";
  lastSecond = millis();
  spawnAnomaly();
}

function resetGame() {
  score = 0;
  misses = 0;
  timeLeft = 30;
  gameState = "idle";
  anomaly.active = false;
}

//游戏主体运行代码
function draw() {
  background(10);

  let camW = video.width;
  let camH = video.height;

  let scaleFactor = min(width / camW, height / camH);
  let drawW = camW * scaleFactor;
  let drawH = camH * scaleFactor;
  let offsetX = (width - drawW) / 2;
  let offsetY = (height - drawH) / 2;

  let filtered = createImage(video.width, video.height);
  applyBaseFilter(filtered);

  if (gameState === "playing" && anomaly.active) {
    applyAnomaly(filtered);
  }

  push();
  translate(offsetX + drawW, offsetY);
  scale(-1, 1);
  image(filtered, 0, 0, drawW, drawH);
  pop();

  drawHUD(offsetX, offsetY, drawW, drawH);

  if (gameState === "playing") {
    updateTimer();
  }

  if (gameState === "end") {
    drawEndScreen();
  }
}

//部分function的实际功能

//基础滤镜效果

function applyBaseFilter(img) {
  video.loadPixels();
  img.loadPixels();

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      let i = (x + y * video.width) * 4;

      let r = video.pixels[i];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];

      let bright = 0.299 * r + 0.587 * g + 0.114 * b;

      
      r = r * 0.75;
      g = g * 0.9;
      b = b * 1.15;

      
      if (bright > 140) {
        r += 10;
        g += 10;
        b += 10;
      } else {
        r -= 10;
        g -= 10;
        b -= 10;
      }

      
      if (y % 4 === 0) {
        r *= 0.9;
        g *= 0.9;
        b *= 0.9;
      }

      
      let grain = random(-8, 8);
      r += grain;
      g += grain;
      b += grain;

      img.pixels[i] = constrain(r, 0, 255);
      img.pixels[i + 1] = constrain(g, 0, 255);
      img.pixels[i + 2] = constrain(b, 0, 255);
      img.pixels[i + 3] = 255;
    }
  }

  img.updatePixels();
}

//异常效果
function applyAnomaly(img) {
  img.loadPixels();

  let ax = floor(anomaly.x);
  let ay = floor(anomaly.y);
  let aw = floor(anomaly.w);
  let ah = floor(anomaly.h);

  for (let y = ay; y < ay + ah; y++) {
    for (let x = ax; x < ax + aw; x++) {
      if (x < 0 || x >= img.width || y < 0 || y >= img.height) continue;

      let i = (x + y * img.width) * 4;

      if (anomaly.type === 0) {
        // 颜色反转
        img.pixels[i] = 255 - img.pixels[i];
        img.pixels[i + 1] = 255 - img.pixels[i + 1];
        img.pixels[i + 2] = 255 - img.pixels[i + 2];
      } else if (anomaly.type === 1) {
        // 红色
        img.pixels[i] = constrain(img.pixels[i] + 120, 0, 255);
        img.pixels[i + 1] *= 0.4;
        img.pixels[i + 2] *= 0.4;
      }
    }
  }

  if (anomaly.type === 2) {
    // 像素化 
    let blockSize = 12;

    for (let y = ay; y < ay + ah; y += blockSize) {
      for (let x = ax; x < ax + aw; x += blockSize) {
        if (x < 0 || x >= img.width || y < 0 || y >= img.height) continue;

        let sampleIndex = (x + y * img.width) * 4;
        let sr = img.pixels[sampleIndex];
        let sg = img.pixels[sampleIndex + 1];
        let sb = img.pixels[sampleIndex + 2];

        for (let yy = y; yy < y + blockSize; yy++) {
          for (let xx = x; xx < x + blockSize; xx++) {
            if (xx < 0 || xx >= img.width || yy < 0 || yy >= img.height) continue;
            if (xx >= ax + aw || yy >= ay + ah) continue;

            let ii = (xx + yy * img.width) * 4;
            img.pixels[ii] = sr;
            img.pixels[ii + 1] = sg;
            img.pixels[ii + 2] = sb;
          }
        }
      }
    }
  }

  img.updatePixels();
}

function spawnAnomaly() {
  anomaly.w = random(100, 170);
  anomaly.h = random(100, 170);
  anomaly.x = random(40, video.width - anomaly.w - 40);
  anomaly.y = random(40, video.height - anomaly.h - 40);
  anomaly.type = floor(random(3));
  anomaly.active = true;
}

function updateTimer() {
  if (millis() - lastSecond >= 1000) {
    timeLeft--;
    lastSecond = millis();

    if (timeLeft <= 0) {
      timeLeft = 0;
      gameState = "end";
      anomaly.active = false;
    }
  }
}

//UI界面确立
function drawHUD(x, y, w, h) {
  noFill();
  stroke(255);
  strokeWeight(2);
  rect(x, y, w, h);

  stroke(255, 90);
  line(x + 20, y + 20, x + 80, y + 20);
  line(x + 20, y + 20, x + 20, y + 80);

  line(x + w - 20, y + 20, x + w - 80, y + 20);
  line(x + w - 20, y + 20, x + w - 20, y + 80);

  line(x + 20, y + h - 20, x + 80, y + h - 20);
  line(x + 20, y + h - 20, x + 20, y + h - 80);

  line(x + w - 20, y + h - 20, x + w - 80, y + h - 20);
  line(x + w - 20, y + h - 20, x + w - 20, y + h - 80);

  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);
  text("ANOMALY CAMERA", x + 15, y + 15);

  textSize(14);
  text("State: " + gameState.toUpperCase(), x + 15, y + 42);
  text("Score: " + score, x + 15, y + 62);
  text("Misses: " + misses, x + 15, y + 82);
  text("Time: " + timeLeft, x + 15, y + 102);

  if (gameState === "idle") {
    fill(255, 220);
    textSize(22);
    textAlign(CENTER, CENTER);
    text("Press START SCAN to begin", x + w / 2, y + h - 40);
  }

  if (gameState === "playing") {
    fill(255, 220);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Find the anomaly and click to repair it", x + w / 2, y + h - 36);
  }
}

function drawEndScreen() {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(34);
  text("SCAN COMPLETE", width / 2, height / 2 - 50);

  textSize(22);
  text("Repairs: " + score, width / 2, height / 2);
  text("Misses: " + misses, width / 2, height / 2 + 35);

  let accuracy = 0;
  if (score + misses > 0) {
    accuracy = floor((score / (score + misses)) * 100);
  }

  text("Accuracy: " + accuracy + "%", width / 2, height / 2 + 70);
  textSize(18);
  text("Press RESET or START SCAN to play again", width / 2, height / 2 + 115);
}

//鼠标点击
function mousePressed() {
  if (gameState !== "playing" || !anomaly.active) return;

  let camW = video.width;
  let camH = video.height;

  let scaleFactor = min(width / camW, height / camH);
  let drawW = camW * scaleFactor;
  let drawH = camH * scaleFactor;
  let offsetX = (width - drawW) / 2;
  let offsetY = (height - drawH) / 2;

 
  if (
    mouseX < offsetX ||
    mouseX > offsetX + drawW ||
    mouseY < offsetY ||
    mouseY > offsetY + drawH
  ) {
    return;
  }

  
  let localX = mouseX - offsetX;
  let localY = mouseY - offsetY;

  let videoX = map(localX, 0, drawW, video.width, 0);
  let videoY = map(localY, 0, drawH, 0, video.height);

  if (
    videoX > anomaly.x &&
    videoX < anomaly.x + anomaly.w &&
    videoY > anomaly.y &&
    videoY < anomaly.y + anomaly.h
  ) {
    score++;
    spawnAnomaly();
  } else {
    misses++;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}