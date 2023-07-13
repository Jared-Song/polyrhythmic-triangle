const canvas = document.querySelector("#canvas");
const pen = canvas.getContext("2d");

const startTime = new Date().getTime();

const anchorAngle1 = 0;
const anchorAngle2 = (2 * Math.PI) / 3;
const anchorAngle3 = (4 * Math.PI) / 3;

// const numTriangles = 21;
const numTriangles = 21;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const anchorRadius = canvas.height * 0.4;
const circleRadius = anchorRadius * 0.025;
const musicCircleRadius = circleRadius * 0.35;
let triangles = [];

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

let anchor = drawAnchor(center, 0);
let x1 = anchor.x1,
  y1 = anchor.y1,
  x2 = anchor.x2,
  y2 = anchor.y2,
  x3 = anchor.x3,
  y3 = anchor.y3;

for (i = 0; i < numTriangles; i++) {
  initInnerTriangles(x1, y1, x2, y2, x3, y3, i);
  initNote(i);
}

function initInnerTriangles(x1, y1, x2, y2, x3, y3, index) {
  const fraction = index / numTriangles;
  const newX1 = (x2 - x1) * fraction + x1;
  const newY1 = (y2 - y1) * fraction + y1;

  const newX2 = (x3 - x2) * fraction + x2;
  const newY2 = (y3 - y2) * fraction + y2;

  initTriangle(newX1, newY1, newX2, newY2, index);
}

const draw = () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  const currentTime = new Date().getTime();
  let elapsedTime = (currentTime - startTime) / 1000;

  const anchor = drawAnchor(center, elapsedTime);
  const x1 = anchor.x1,
    y1 = anchor.y1,
    x2 = anchor.x2,
    y2 = anchor.y2,
    x3 = anchor.x3,
    y3 = anchor.y3;

  for (i = 0; i < numTriangles; i++) {
    drawInnerTriangles(x1, y1, x2, y2, x3, y3, i, elapsedTime);
    if (currentTime >= triangles[i][3]) {
      triangles[i][4].play()
      triangles[i][2] = triangles[i][3]
    }

    triangles[i][3] = calculateNextBeatTime(triangles[i][2], triangles[i][1], triangles[i][0])
  }

  requestAnimationFrame(draw);
};
draw();

function initNote(index) {
  const audio = new Audio(`resources/${index + 1}.mp3`)
  audio.volume = 0.15;
  
  triangles[i][4] = audio;
}

function calculateNextBeatTime(lastBeatTime, distance, velocity) {
  // velocity = distance * time
  // time = distance / velocity
  return lastBeatTime + (distance / velocity) * 1000;
}

function drawInnerTriangles(x1, y1, x2, y2, x3, y3, index, elapsedTime) {
  pen.strokeStyle = "gray";
  pen.lineWidth = 0.5;

  const fraction = index / numTriangles;
  const newX1 = (x2 - x1) * fraction + x1;
  const newY1 = (y2 - y1) * fraction + y1;

  const newX2 = (x3 - x2) * fraction + x2;
  const newY2 = (y3 - y2) * fraction + y2;

  const newX3 = (x1 - x3) * fraction + x3;
  const newY3 = (y1 - y3) * fraction + y3;

  drawTriangle(newX1, newY1, newX2, newY2, newX3, newY3);
  drawMusicCircles(
    newX1,
    newY1,
    newX2,
    newY2,
    newX3,
    newY3,
    elapsedTime,
    index
  );
}

function drawMusicCircles(x1, y1, x2, y2, x3, y3, elapsedTime, index) {
  // draw music circles
  pen.fillStyle = "purple";
  pen.lineWidth = 1;

  const pos1 = getMovingPos(x1, y1, x2, y2, index, elapsedTime);
  pen.beginPath();
  pen.arc(pos1.newX, pos1.newY, musicCircleRadius, 0, 2 * Math.PI);
  pen.fill();

  const pos2 = getMovingPos(x2, y2, x3, y3, index, elapsedTime);
  pen.beginPath();
  pen.arc(pos2.newX, pos2.newY, musicCircleRadius, 0, 2 * Math.PI);
  pen.fill();

  const pos3 = getMovingPos(x3, y3, x1, y1, index, elapsedTime);
  pen.beginPath();
  pen.arc(pos3.newX, pos3.newY, musicCircleRadius, 0, 2 * Math.PI);
  pen.fill();
}

function drawAnchor(center, elapsedTime) {
  pen.strokeStyle = "blue";
  pen.lineWidth = 1.5;

  // draw anchor circle 1
  let angle = anchorAngle1 + elapsedTime / 10;
  const x1 = center.x + anchorRadius * Math.cos(angle),
    y1 = center.y + anchorRadius * Math.sin(angle);
  pen.beginPath();
  pen.arc(x1, y1, circleRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw anchor circle 2
  angle = anchorAngle2 + elapsedTime / 10;
  const x2 = center.x + anchorRadius * Math.cos(angle),
    y2 = center.y + anchorRadius * Math.sin(angle);
  pen.beginPath();
  pen.arc(x2, y2, circleRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw anchor circle 3
  angle = anchorAngle3 + elapsedTime / 10;
  const x3 = center.x + anchorRadius * Math.cos(angle),
    y3 = center.y + anchorRadius * Math.sin(angle);
  pen.beginPath();
  pen.arc(x3, y3, circleRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw anchor circle
  pen.strokeStyle = "gray";
  pen.lineWidth = 0.5;
  pen.beginPath();
  pen.arc(center.x, center.y, anchorRadius, 0, 2 * Math.PI);
  pen.stroke();

  // anchor triangle
  drawTriangle(x1, y1, x2, y2, x3, y3);
  return { x1, y1, x2, y2, x3, y3 };
}

function drawTriangle(x1, y1, x2, y2, x3, y3) {
  pen.beginPath();
  pen.moveTo(x1, y1);
  pen.lineTo(x2, y2);
  pen.stroke();

  pen.beginPath();
  pen.moveTo(x2, y2);
  pen.lineTo(x3, y3);
  pen.stroke();

  pen.beginPath();
  pen.moveTo(x3, y3);
  pen.lineTo(x1, y1);
  pen.stroke();
}

function initTriangle(x1, y1, x2, y2, index) {
  let delta_x = x2 - x1;
  let delta_y = y2 - y1;
  const maxDistance = Math.sqrt(delta_x * delta_x + delta_y * delta_y);

  // velocity = number of bounces * distance / time for complete cycle e.g. 900 seconds or 15 mins
  const numBounces = 100 - index;
  const cycleDuration = 900; // 900 = 15 mins
  const velocity = (numBounces * maxDistance) / cycleDuration;

  triangles[index] = [velocity, maxDistance, startTime, calculateNextBeatTime(startTime, maxDistance, velocity)];
}

function getMovingPos(x1, y1, x2, y2, index, elapsedTime) {
  const velocity = triangles[index][0];
  const maxDistance = triangles[index][1];
  
  let delta_x = x2 - x1;
  let delta_y = y2 - y1;
  const distance = elapsedTime * velocity;
  const modDistance = distance % (2 * maxDistance); // double the maxDistance for oscillation

  let newX, newY;
  if (modDistance < maxDistance) {
    newX = x1 + (delta_x / maxDistance) * modDistance;
    newY = y1 + (delta_y / maxDistance) * modDistance;
  } else {
    newX = x2 - (delta_x / maxDistance) * (modDistance - maxDistance);
    newY = y2 - (delta_y / maxDistance) * (modDistance - maxDistance);
  }

  return { newX, newY };
}
