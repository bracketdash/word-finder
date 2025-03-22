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
  const cleanValue = template.value.toLowerCase().replace(/[^a-z\?]/g, "");
  if (template.value !== cleanValue) {
    template.value = cleanValue;
  }
  checkBoard();
}

function handleChangeLength() {
  const cleanValue = length.value.replace(/[^0-9]/g, "");
  if (length.value !== cleanValue) {
    length.value = cleanValue;
  }
  checkBoard();
}

function handleChangeTray() {
  const cleanValue = tray.value.toLowerCase().replace(/[^a-z]/g, "");
  if (tray.value !== cleanValue) {
    tray.value = cleanValue;
  }
  checkBoard();
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
