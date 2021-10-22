var capture;
var tracker;
var positions;
var pointsLx;
var pointsRx;
var pointsLy;
var pointsRy;
var lines;
var time;
var w = 0;
var h = 0;

function setup() {
  w = windowWidth;
  h = windowHeight;
  capture = createCapture(VIDEO);
  image(capture, 0, 0);
//  if (h > w) {
//	  image(capture, 0, 0, w, w);
//	  createCanvas(w, w);
//	  capture.size(w, w);
//  } else {
//	  image(capture, 0, 0, h, h);
//	  createCanvas(h, h);
//	  capture.size(h, h);
//  }
	
  image(capture, 0, 0, 800, 600);
  createCanvas(800, 600);
  capture.size(800, 600);
  capture.hide();
  
  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
  
  pointsLx = [];
  pointsLy = [];
  pointsRx = [];
  pointsRy = [];
  lines = [];
  time = 0;

  frameRate(5);
  colorMode(HSB);
  background(0);
}

function draw() {
//	if (h > w) {
//		translate(w, 0);
//		scale(-1.0, 1.0);
//  		image(capture, 0, 0);
//	} else {
//		translate(h, 0);
//		scale(-1.0, 1.0);
//  		image(capture, 0, 0);
//	}
	
  translate(800, 0);
  scale(-1.0, 1.0);
  image(capture, 0, 0, 800, 600);
  positions = tracker.getCurrentPosition();
  if (positions.length > 0) {
    var eyeL = {
      pupil: getPoint(27)
    };
    
    var eyeR = {
      pupil: getPoint(32)
    };
    
    for (var i = 0; i < positions.length - 1; i++) {
      var rand = Math.floor(Math.random() * pointsLx.length);
      pointsLx.push(eyeL.pupil.x);
      pointsLy.push(eyeL.pupil.y);
      pointsRx.push(eyeR.pupil.x);
      pointsRy.push(eyeR.pupil.y);
      if (pointsLx.length > 5000) {
        if (millis() > time) {
          pointsLx.splice(rand, 1);
          pointsLy.splice(rand, 1);
          pointsRx.splice(rand, 1);
          pointsRy.splice(rand, 1);
          time = millis();
        }
        
      }
      for (var k = 0; k < pointsLx.length - 1; k += 100) {
        fill(255);
        noStroke();
        ellipse(pointsLx[k], pointsLy[k], 5);
        ellipse(pointsRx[k], pointsRy[k], 5);
      }
    }
    
    for (var j = 0; j < pointsLx.length - 2; j++) {
      stroke(255);
      lines.push(line(pointsLx[j], pointsLy[j], pointsLx[j + 1], pointsLy[j + 1]));
      lines.push(line(pointsRx[j], pointsRy[j], pointsRx[j + 1], pointsRy[j + 1]));
    }
  }
}

function keyPressed() {
  setup();
  draw();
}

function getPoint(index) {
  return createVector(positions[index][0], positions[index][1]);
}

function mouseClicked() {
  saveCanvas("Trail" + millis(), "png");
}

function windowResized() {
  setup();
  draw();
}