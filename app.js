const canvas = document.querySelector("#canvas");
const pen = canvas.getContext("2d");
pen.shadowColor = "white";
pen.shadowBlur = 100;

const settings = {
  reverse: false,
};

const startTime = new Date().getTime();

const anchorAngle1 = 0;
const anchorAngle2 = (2 * Math.PI) / 3;
const anchorAngle3 = (4 * Math.PI) / 3;

const numTriangles = 21;
// const numTriangles = 1;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const anchorRadius = canvas.height * 0.4;
const circleRadius = anchorRadius * 0.025;
const musicCircleRadius = circleRadius * 0.25;
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

  const anchor = drawAnchor(center, elapsedTime, currentTime);
  const x1 = anchor.x1,
    y1 = anchor.y1,
    x2 = anchor.x2,
    y2 = anchor.y2,
    x3 = anchor.x3,
    y3 = anchor.y3;

  for (i = 0; i < numTriangles; i++) {
    drawInnerTriangles(x1, y1, x2, y2, x3, y3, i, elapsedTime, currentTime);
    if (currentTime >= triangles[i][3]) {
      triangles[i][4].play();
      triangles[i][2] = triangles[i][3];
    }

    triangles[i][3] = calculateNextBeatTime(
      triangles[i][2],
      triangles[i][1],
      triangles[i][0]
    );
  }

  requestAnimationFrame(draw);
};
draw();

function initNote(index) {
  let note;
  if (settings.reverse) {
    note = index + 1;
  } else {
    note = numTriangles - index;
  }
  const audio = new Audio(`resources/${note}.mp3`);
  audio.volume = 0.15;

  triangles[i][4] = audio;
}

function calculateNextBeatTime(lastBeatTime, distance, velocity) {
  // velocity = distance * time
  // time = distance / velocity
  return lastBeatTime + (distance / velocity) * 1000;
}

function drawInnerTriangles(
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
  index,
  elapsedTime,
  currentTime
) {
  const fraction = index / numTriangles;
  const newX1 = (x2 - x1) * fraction + x1;
  const newY1 = (y2 - y1) * fraction + y1;

  const newX2 = (x3 - x2) * fraction + x2;
  const newY2 = (y3 - y2) * fraction + y2;

  const newX3 = (x1 - x3) * fraction + x3;
  const newY3 = (y1 - y3) * fraction + y3;

  drawTriangle(newX1, newY1, newX2, newY2, newX3, newY3, currentTime, index);
  drawMusicCircles(
    newX1,
    newY1,
    newX2,
    newY2,
    newX3,
    newY3,
    elapsedTime,
    currentTime,
    index
  );
}

function drawMusicCircles(x1, y1, x2, y2, x3, y3, elapsedTime, currentTime, index) {
  // draw music circles
  pen.fillStyle = "white";
  pen.lineWidth = 2;

  pen.globalAlpha = calculateOpacity(currentTime, triangles[index][2], 0, 1, 4000);
  const pos1 = getMovingPos(x1, y1, x2, y2, index, elapsedTime);
  pen.beginPath();
  pen.arc(pos1.newX, pos1.newY, musicCircleRadius, 0, 2 * Math.PI);
  pen.fill();
  pen.globalAlpha = 0.7;
  pen.strokeStyle = "#7470b6";
  pen.stroke();

  pen.globalAlpha = calculateOpacity(currentTime, triangles[index][2], 0, 1, 4000);
  const pos2 = getMovingPos(x2, y2, x3, y3, index, elapsedTime);
  pen.beginPath();
  pen.arc(pos2.newX, pos2.newY, musicCircleRadius, 0, 2 * Math.PI);
  pen.fill();
  pen.globalAlpha = 0.7;
  pen.strokeStyle = "#7470b6";
  pen.stroke();

  pen.globalAlpha = calculateOpacity(currentTime, triangles[index][2], 0, 1, 4000);
  const pos3 = getMovingPos(x3, y3, x1, y1, index, elapsedTime);
  pen.beginPath();
  pen.arc(pos3.newX, pos3.newY, musicCircleRadius, 0, 2 * Math.PI);
  pen.fill();
  pen.globalAlpha = 0.7;
  pen.strokeStyle = "#7470b6";
  pen.stroke();
}

function drawAnchor(center, elapsedTime) {
  pen.strokeStyle = "#7470b6";
  pen.lineWidth = 2;

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
  return { x1, y1, x2, y2, x3, y3 };
}

function calculateOpacity(currentTime, lastImpactTime, baseOpacity, maxOpacity, duration) {
  const timeSinceImpact = currentTime - lastImpactTime,
    percentage = Math.min(timeSinceImpact / duration, 1),
    opacityDelta = maxOpacity - baseOpacity;
  return maxOpacity - opacityDelta * percentage;
}

function drawTriangle(x1, y1, x2, y2, x3, y3, currentTime, index) {
  pen.lineWidth = 0.5;
  pen.globalAlpha = calculateOpacity(currentTime, triangles[index][2], 0, 1, 8000);
  pen.strokeStyle = "#F5c782";

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

  triangles[index] = [
    velocity,
    maxDistance,
    startTime,
    calculateNextBeatTime(startTime, maxDistance, velocity),
  ];
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
