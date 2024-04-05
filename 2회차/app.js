// 1. 캔버스 선언
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); //context 의 줄임말로 ctx 사용

canvas.width = 800;
canvas.height = 800; // 사이즈를 지정해주지 않으면 크기가 안맞음

// 2. 마우스로 선을 그을 때
//    마우스 버튼을 누르고 있으면 선을 긋고, 버튼을 떼면 포인터 이동만 한다.
function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}
canvas.addEventListener("mousemove", onMove);

let isPainting = false;

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

// 캔버스 밖으로 나갔을 때 선이 계속 그어지는 버그가 있음. 해결방법 2가지
// 1. addEventListener를 통해 캔버스에서 mouseleave 나가면 onMouseUp 호출
canvas.addEventListener("mouseleave", cancelPainting);
// 2. document에 mouseup 이벤트를 준다.
// 문서 어느 위치에서든 onMouseUp 이벤트 발생 시 그림 그리는 것 중지
// document.addEventListener("mouseup", onMouseUp);

/* 여러 곳에서 onMouseUp을 호출해서 그림그리기 중지를 하고 있음 => 메서드 변경 */

// 3. 브러쉬의 굵기변경
const lineWidth = document.getElementById("line-width");
ctx.lineWidth = lineWidth.value; // 브러쉬 굵기

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
  console.log("lineWidth : ", lineWidth.value);
}
lineWidth.addEventListener("click", onLineWidthChange);

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
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

modeBtn.addEventListener("click", onModeClick);
