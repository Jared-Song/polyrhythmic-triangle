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

  const currentTime = new Date().getTime(),
    elapsedTime = (currentTime - startTime) / 1000;

  // draw circles
  pen.strokeStyle = "blue";
  pen.lineWidth = 1.5;

  // draw small circle 1
  let angle = circleAngleOne + elapsedTime / 10;
  const circleOneX = center.x + anchorRadius * Math.cos(angle),
    circleOneY = center.y + anchorRadius * Math.sin(angle);
  pen.beginPath();
  pen.arc(circleOneX, circleOneY, circleRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw small circle 2
  angle = circleAngleTwo + elapsedTime / 10;
  const circleTwoX = center.x + anchorRadius * Math.cos(angle),
    circleTwoY = center.y + anchorRadius * Math.sin(angle);
  pen.beginPath();
  pen.arc(circleTwoX, circleTwoY, circleRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw small circle 3
  angle = circleAngleThree + elapsedTime / 10;
  const circleThreeX = center.x + anchorRadius * Math.cos(angle),
    circleThreeY = center.y + anchorRadius * Math.sin(angle);
  pen.beginPath();
  pen.arc(circleThreeX, circleThreeY, circleRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw anchor circle
  pen.strokeStyle = "gray";
  pen.lineWidth = 0.5;
  pen.beginPath();
  pen.arc(center.x, center.y, anchorRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw frame
  pen.beginPath();
  pen.moveTo(circleOneX, circleOneY);
  pen.lineTo(circleTwoX, circleTwoY);
  pen.stroke();

  pen.beginPath();
  pen.moveTo(circleTwoX, circleTwoY);
  pen.lineTo(circleThreeX, circleThreeY);
  pen.stroke();

  pen.beginPath();
  pen.moveTo(circleThreeX, circleThreeY);
  pen.lineTo(circleOneX, circleOneY);
  pen.stroke();

  // draw music circles
  pen.strokeStyle = "purple";
  pen.lineWidth = 0.5;
  pen.beginPath();
  pen.arc(
    (circleOneX + circleTwoX) / 2,
    (circleOneY + circleTwoY) / 2,
    musicCircleRadius,
    0,
    2 * Math.PI
  );
  pen.stroke();

  requestAnimationFrame(draw);
};
draw();
