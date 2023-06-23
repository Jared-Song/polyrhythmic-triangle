const canvas = document.querySelector("#canvas");
const pen = canvas.getContext("2d");

const startTime = new Date().getTime();

const draw = () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const anchorRadius = canvas.width * 0.25;

  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  // const currentTime = new Date().getTime(),
  //   elapsedTime = (currentTime - startTime) / 1000;

  // draw anchor circle
  pen.strokeStyle = "gray";
  pen.lineWidth = 0.5;
  pen.beginPath();
  pen.arc(center.x, center.y, anchorRadius, 0, 2 * Math.PI);
  pen.stroke();

  // draw frame
  pen.strokeStyle = "gray";
  pen.lineWidth = 0.5;

  requestAnimationFrame(draw);
};
draw();
