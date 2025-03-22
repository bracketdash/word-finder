const template = document.querySelector('input[name="template"]');
const length = document.querySelector('input[name="length"]');
const lengthType = document.querySelectorAll('input[name="lengthtype"]');
const tray = document.querySelector('input[name="tray"]');
const trayType = document.querySelectorAll('input[name="traytype"]');

function checkBoard() {
  // TODO
  console.log("checkBoard");
}

function handleChangeTemplate() {
  // TODO
  console.log("handleChangeTemplate");
}

function handleChangeLength() {
  // TODO
  console.log("handleChangeLength");
}

function handleChangeTray() {
  // TODO
  console.log("handleChangeTray");
}

template.addEventListener("keyup", handleChangeTemplate);

length.addEventListener("keyup", handleChangeLength);
length.addEventListener("change", handleChangeLength);

lengthType.forEach((input) => {
  input.addEventListener("change", checkBoard);
});

tray.addEventListener("keyup", handleChangeTray);

trayType.forEach((input) => {
  input.addEventListener("change", checkBoard);
});
