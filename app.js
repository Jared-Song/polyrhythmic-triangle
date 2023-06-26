const canvas = document.querySelector("#canvas");
const pen = canvas.getContext("2d");

const startTime = new Date().getTime();

const circleAngleOne = 0;
const circleAngleTwo = (2 * Math.PI) / 3;
const circleAngleThree = (4 * Math.PI) / 3;

const draw = () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const anchorRadius = canvas.height * 0.4;
  const circleRadius = anchorRadius * 0.025;
  const musicCircleRadius = circleRadius * 0.5;

  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  const currentTime = new Date().getTime();
  let elapsedTime = (currentTime - startTime) / 10000;

  // draw circles
  pen.strokeStyle = "blue";
  pen.lineWidth = 1.5;

  // draw small circle 1
  let angle = circleAngleOne + elapsedTime;
  const x1 = center.x + anchorRadius * Math.cos(angle),
    y1 = center.y + anchorRadius * Math.sin(angle);
  pen.beginPath();
  pen.arc(x1, y1, circleRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw small circle 2
  angle = circleAngleTwo + elapsedTime;
  const x2 = center.x + anchorRadius * Math.cos(angle),
    y2 = center.y + anchorRadius * Math.sin(angle);
  pen.beginPath();
  pen.arc(x2, y2, circleRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw small circle 3
  angle = circleAngleThree + elapsedTime;
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

  // draw frame
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

  // draw music circles
  pen.strokeStyle = "purple";
  pen.lineWidth = 1;
  const velocity = 2000;
  const pos1 = getMovingPos(x1, y1, x2, y2, velocity, elapsedTime);
  pen.beginPath();
  pen.arc(pos1.newX, pos1.newY, musicCircleRadius, 0, 2 * Math.PI);
  pen.stroke();

  const pos2 = getMovingPos(x2, y2, x3, y3, velocity, elapsedTime);
  pen.beginPath();
  pen.arc(pos2.newX, pos2.newY, musicCircleRadius, 0, 2 * Math.PI);
  pen.stroke();

  const pos3 = getMovingPos(x3, y3, x1, y1, velocity, elapsedTime);
  pen.beginPath();
  pen.arc(pos3.newX, pos3.newY, musicCircleRadius, 0, 2 * Math.PI);
  pen.stroke();

  requestAnimationFrame(draw);
};
draw();

function getMovingPos(x1, y1, x2, y2, velocity, elapsedTime) {
  let delta_x = x2 - x1;
  let delta_y = y2 - y1;
  const maxDistance = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
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
