const save = document.getElementById("save-btn");

const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");

const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");

const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); //context = canvas의 브러쉬, ctx로 줄임

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth.value;

let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting(event) {
  isPainting = true; //마우스를 계속 누르고 있을 때
}

function cancelPainting(event) {
  isPainting = false; //마우스를 누르지 않을 때
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
  console.log("event.target.value: ", event.target.value);
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

function onDoubleClick(event) {
  ctx.save();
  const text = textInput.value;
  ctx.lineWidth = 1;
  onFontSelect();
  ctx.fillText(text, event.offsetX, event.offsetY);
  ctx.restore();
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);

fileInput.addEventListener("change", onFileChange);

save.addEventListener("click", onSaveClick);

// 1. 텍스트의 폰트를 바꿔서 넣을 수 있게 바꾸기
// 1-1. select 박스에서 옵션 선택
const fontSelect = document.getElementById("font-select");

// 1-2. select 박스에서 option 선택 시 값 가져오기
function onFontSelect() {
  const selectFont = fontSelect.options[fontSelect.selectedIndex];
  let selectFontValue = selectFont.value;

  if (selectFontValue == "chab") {
    let chab = new FontFace("Lotteria Chab", "url(asset/fonts/chab.woff2)");

    chab.load().then(
      () => {
        // Ready to use the font in a canvas context
        console.log(selectFontValue);
      },
      (error) => {
        alert("error", error);
        console.error(error);
      }
    );
    ctx.font = "100px Lotteria Chab";
  } else if (selectFontValue == "ddag") {
    let ddag = new FontFace("Lotteria Ddag", "url(asset/fonts/ddag.woff2)");

    ddag.load().then(
      () => {
        // Ready to use the font in a canvas context
        console.log(selectFontValue);
      },
      (error) => {
        alert("error", error);
        console.error(error);
      }
    );
    ctx.font = "100px Lotteria Ddag";
  }
}

fontSelect.addEventListener("change", onFontSelect);

// 2. 폰트 사이즈 바꿀 수 있게 하기
// 3. fill, stroke 바꾸기
// 4. 이미지가 정사각형이 아닐 시 화면 비율 깨지지 않게 만들 방법 생각해보기
// 5. 마우스 포인터가 fill-mode일때는 bucket, draw-mode일때는 pencil로 만들어보기
// 6. undo, redo 기능 만들어보기...
// 7. 말풍선을 넣고 텍스트를 넣는 기능 만들 생각 해보기
