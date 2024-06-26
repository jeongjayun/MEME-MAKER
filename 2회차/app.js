// 1. 캔버스 선언
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); //context 의 줄임말로 ctx 사용

let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT; // 사이즈를 지정해주지 않으면 크기가 안맞음

// State 알려주기
const brushState = document.getElementById("brush-state");
const ctxState = document.getElementById("ctx-state");

// 2. 마우스로 선을 그을 때
//    마우스 버튼을 누르고 있으면 선을 긋고, 버튼을 떼면 포인터 이동만 한다.

let isPainting = false;
let isBrushFill = false; // 2-1. 선 모드 or 선 채우기 모드

const brushStrokeBtn = document.getElementById("brush-stroke-btn");
const brushFillBtn = document.getElementById("brush-fill-btn");

function onBrushStroke() {
  isBrushFill = false;
  brushState.value = "Stroke";
}
brushStrokeBtn.addEventListener("click", onBrushStroke);

function onBrushFill() {
  isBrushFill = true;
  brushState.value = "Fill";
}
brushFillBtn.addEventListener("click", onBrushFill);

function onMove(event) {
  // console.log(event.offsetX, event.offsetY);

  ctx.lineTo(event.offsetX, event.offsetY);
  if (isPainting) {
    // console.log(event.offsetX, event.offsetY);
    ctx.lineTo(event.offsetX, event.offsetY);
    isBrushFill ? ctx.fill() : ctx.stroke();
    return;
  }

  // ctx.stroke(); /* 아까 안됐던 이유! 모드 설정하는 변수 if문 안에 stroke() 있어서!! */

  ctx.beginPath(); // 기존의 path를 끊고 새로운 path 시작
  // beginPath 가 없으면 선이 계속 이어지고 색 변경도 안됨!

  ctx.moveTo(event.offsetX, event.offsetY);
}
canvas.addEventListener("mousemove", onMove);

function onMouseDown(event) {
  // 마우스 누르고 있을 때 = 선긋기
  isPainting = true;
}
canvas.addEventListener("mousedown", onMouseDown);

function cancelPainting(event) {
  // 마우스 뗐을 때 선 그만 긋기
  isPainting = false;
}
canvas.addEventListener("mouseup", cancelPainting);

/* 캔버스 밖으로 나갔을 때 선이 계속 그어지는 버그가 있음. 해결방법 2가지 */
// 1. addEventListener를 통해 캔버스에서 mouseleave 나가면 onMouseUp 호출
canvas.addEventListener("mouseleave", cancelPainting);

// 2. document에 mouseup 이벤트를 준다.
// 문서 어느 위치에서든 onMouseUp 이벤트 발생 시 그림 그리는 것 중지
// document.addEventListener("mouseup", onMouseUp);

/* 여러 곳에서 onMouseUp을 호출해서 그림그리기 중지를 하고 있음 => 메서드 변경 */

// 3. 브러쉬의 굵기변경
const lineWidth = document.getElementById("line-width");
// 3-1. 현재 브러쉬의 사이즈 텍스트로 보여주기
const brushSize = document.getElementById("brush-size");

ctx.lineWidth = lineWidth.value; // 브러쉬 굵기
ctx.lineCap = "round"; // 브러쉬 둥글게

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
  brushSize.value = event.target.value;
}
lineWidth.addEventListener("change", onLineWidthChange);

// 4. 브러쉬의 색을 변경
// 4-1. input color 를 사용하여 색변경
const color = document.getElementById("color");

function onColorChange(event) {
  console.log(event.target.value);
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}
color.addEventListener("change", onColorChange);

// 4-2. color options 사용하여 색변경
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
); //HTMLCollection으로 Array like 객체(Array 아님!!!)를 자바스크립트 배열객체로 생성

function onColorClick(event) {
  console.log(event);
  // console.dir(event.target.dataset.color); 중복값 제거
  const colorValue = event.target.dataset.color;

  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;

  // 4-3. input color, color option 동시에 색 바뀌게
  color.value = colorValue;
}
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

// 5. 그리기 / 채우기 모드 변경
const modeBtn = document.getElementById("mode-btn");

let isFilling = false;

function onModeClick() {
  if (isFilling) {
    // 만약 사용자가 채우기 모드"일" 때
    isFilling = false; // 버튼 클릭하면 채우기 모드를 중지
    ctxState.value = "그리기";
    modeBtn.innerText = "채우기"; // 버튼의 텍스트를 Draw로 바꿔 모드가 변경됨 표시
    document.querySelector(".draw-mode").style.display = "block";
  } else {
    // 만약 사용자가 채우기 모드가 "아닐" 때 이 버튼을 누르면
    isFilling = true; // 채우기 모드 실행
    ctxState.value = "채우기";
    modeBtn.innerText = "그리기";
    document.querySelector(".draw-mode").style.display = "none";
  }
}
modeBtn.addEventListener("click", onModeClick);

// 5-1.  전체 채우기
function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
canvas.addEventListener("click", onCanvasClick);

// 6. 지우기
// 6-1. 전체 지우기
const destroyBtn = document.getElementById("destroy-btn");

function onDestoryClick() {
  if (confirm("전부 지워집니다. 지우시겠습니까?")) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
destroyBtn.addEventListener("click", onDestoryClick);

// 6-2. 지우개 기능
const eraserBtn = document.getElementById("eraser-btn");

function onEraserClick() {
  ctxState.value = "지우기";
  isFilling = false;

  if (isBrushFill) {
    isBrushFill = false;
  }

  ctx.strokeStyle = "white";
  modeBtn.innerText = "채우기";
}
eraserBtn.addEventListener("click", onEraserClick);

// 7. 파일 업로드
const fileInput = document.getElementById("file-input");

function onFileChange(event) {
  const file = event.target.files[0];
  console.log(event);
  const url = URL.createObjectURL(file);
  const image = new Image();
  console.log(url);
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}
fileInput.addEventListener("change", onFileChange);

// 8. 텍스트 추가
const textInput = document.getElementById("text-input");

/* 폰트 스타일 변경 */
let isTextStroke = false; // 꽉채운 글씨

const textFill = document.getElementById("text-fill");
const textStroke = document.getElementById("text-stroke");

function onTextFill() {
  isTextStroke = false;
}
textFill.addEventListener("click", onTextFill);

function onTextStroke() {
  isTextStroke = true;
}
textStroke.addEventListener("click", onTextStroke);

function onDblClick(event) {
  ctx.save();

  const text = textInput.value;
  ctx.lineWidth = 1;

  onFontSelect();

  isTextStroke
    ? ctx.strokeText(text, event.offsetX, event.offsetY)
    : ctx.fillText(text, event.offsetX, event.offsetY);

  ctx.restore();
}
canvas.addEventListener("dblclick", onDblClick);

// 9. 저장하기
const saveBtn = document.getElementById("save-btn");

function onSaveClick(event) {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}
saveBtn.addEventListener("click", onSaveClick);

/* 폰트 변경하기 */
const fontSelect = document.getElementById("font-select");

// 추가 폰트 로드
// function onFontLoad() {
//   let chab = new FontFace("Chab", "url(../asset/fonts/chab.woff2)");
//   chab.load().then(
//     () => {
//       // Ready to use the font in a canvas context
//       console.log("chab 폰트 load 되었습니다.");
//     },
//     (error) => {
//       alert("error", error);
//       console.error(error);
//       console.log(chab);
//     }
//   );

//   let ddag = new FontFace("Ddag", "url(../asset/fonts/ddag.woff2)");
//   ddag.load().then(
//     () => {
//       // Ready to use the font in a canvas context
//       console.log("ddag 폰트 load 되었습니다.");
//     },
//     (error) => {
//       alert("error", error);
//       console.error(error);
//       console.log(ddag);
//     }
//   );
// }

const chab = new FontFace("Lotteria Chab", "url(../asset/fonts/chab.ttf)");
chab.load().then(
  () => {
    // Ready to use the font in a canvas context
    console.log("chab 폰트 사용할 준비가 되었습니다.");
  },
  (error) => {
    alert("error", error);
    console.error(error);
    console.log(chab);
  }
);

const ddag = new FontFace("Lotteria Ddag", "url(../asset/fonts/ddag.ttf)");
ddag.load().then(
  () => {
    // Ready to use the font in a canvas context
    console.log("ddag 폰트 사용할 준비가 되었습니다.");
  },
  (error) => {
    alert("error", error);
    console.error(error);
    console.log(ddag);
  }
);

// 폰트 크기 조절
const textSizeInput = document.getElementById("text-size");
let textSize = 50;
let fontFamily = "serif";

function onTextSize(event) {
  textSize = event.target.value;
}

textSizeInput.addEventListener("change", onTextSize);

function onFontSelect() {
  const fontIndex = fontSelect.options[fontSelect.selectedIndex];
  console.log(fontIndex);
  fontFamily = fontIndex.value;
  console.log(fontFamily);

  ctx.font = `${textSize}px ${fontFamily}`;
}
fontSelect.addEventListener("change", onFontSelect);
