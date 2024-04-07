// 1. 캔버스 선언
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); //context 의 줄임말로 ctx 사용

let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT; // 사이즈를 지정해주지 않으면 크기가 안맞음

// 2. 마우스로 선을 그을 때
//    마우스 버튼을 누르고 있으면 선을 긋고, 버튼을 떼면 포인터 이동만 한다.
let isPainting = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath(); // 기존의 path를 끊고 새로운 path 시작
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

ctx.lineWidth = lineWidth.value; // 브러쉬 굵기
ctx.lineCap = "round"; // 브러쉬 둥글게
function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
  console.log("lineWidth : ", lineWidth.value);
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
    modeBtn.innerText = "Fill"; // 버튼의 텍스트를 Fill 로 바꿔 모드가 변경됨 표시
  } else {
    // 만약 사용자가 채우기 모드가 "아닐" 때 이 버튼을 누르면
    isFilling = true; // 채우기 모드 실행
    modeBtn.innerText = "Draw";
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
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
destroyBtn.addEventListener("click", onDestoryClick);

// 6-2. 지우개 기능
const eraserBtn = document.getElementById("eraser-btn");

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

eraserBtn.addEventListener("click", onEraserClick);

// 7. 파일 업로드
const fileInput = document.getElementById("file-input");

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // fileInput.value = null;
  };
}
fileInput.addEventListener("change", onFileChange);

// 8. 텍스트 추가
const textInput = document.getElementById("text-input");

function onDblClick(event) {
  ctx.save();

  const text = textInput.value;
  ctx.lineWidth = 1;
  // ctx.font = "48px serif";
  onFontSelect();
  console.log(text);
  console.log(event.offsetX, event.offsetY);
  ctx.strokeText(text, event.offsetX, event.offsetY);

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

  // console.log(url);
  // console.log(a);
}
saveBtn.addEventListener("click", onSaveClick);

/* 폰트 변경하기 */
const fontSelect = document.getElementById("font-select");

function onFontSelect() {
  const font = fontSelect.options[fontSelect.selectedIndex];
  let selectedFontValue = font.value;

  if (selectedFontValue == "chab") {
    let chab = new FontFace("Lotteria Chab", "url(../asset/fonts/chab.woff2)");

    chab.load().then(
      () => {
        // Ready to use the font in a canvas context
        console.log(chab);
        console.log(selectedFontValue);
      },
      (error) => {
        alert("error", error);
        console.error(error);
        console.log(chab);
      }
    );
    ctx.font = "100px Lotteria Chab";
  } else if (selectedFontValue == "ddag") {
    let ddag = new FontFace("Lotteria Ddag", "url(../asset/fonts/ddag.woff2)");

    ddag.load().then(
      () => {
        // Ready to use the font in a canvas context
        console.log(selectedFontValue);
        console.log(ddag);
      },
      (error) => {
        alert("error", error);
        console.error(error);
        console.log(ddag);
      }
    );
    ctx.font = "100px Lotteria Ddag";
  }
}
fontSelect.addEventListener("change", onFontSelect);
