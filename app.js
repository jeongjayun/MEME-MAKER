const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); //context = canvas의 브러쉬, ctx로 줄임
canvas.width = 800;
canvas.height = 800;

const colors = [
  "#ff3838",
  "#ffb8b8",
  "#c56cf0",
  "#ff9f1a",
  "#fff200",
  "#32ff7e",
];

ctx.lineWidth = 2;

function onClick(event) {
  ctx.beginPath();
  ctx.moveTo(400, 400);
  const color = colors[Math.floor(Math.random() * colors.length)];
  ctx.strokeStyle = color;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
}

canvas.addEventListener("mousemove", onClick);
