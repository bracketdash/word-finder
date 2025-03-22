const template = document.querySelector('input[name="template"]');
const length = document.querySelector('input[name="length"]');
const lengthType = document.querySelectorAll('input[name="lengthtype"]');
const tray = document.querySelector('input[name="tray"]');
const trayType = document.querySelectorAll('input[name="traytype"]');

let trie = {};

function displayWords() {
  // TODO
  console.log("displayWords");
}

function getTrie(compressed) {
  let decompressed = compressed;
  decompressed = decompressed.replace(/([A-Z])/g, (c) => c.toLowerCase() + "$");
  decompressed = decompressed.replace(/([a-z])/g, '"$1":{');
  decompressed = decompressed.replace(/([0-9]+)/g, "$1,").slice(0, -1);
  decompressed = decompressed.replace(/\$([^0-9])/g, "$,$1");
  const getEndBrackets = (c) => "}".repeat(parseInt(c, 10));
  decompressed = decompressed.replace(/([0-9]+)/g, getEndBrackets);
  decompressed = decompressed.replaceAll("$", '"$":1');
  return JSON.parse(decompressed);
}

function handleChangeTemplate() {
  const cleanValue = template.value.toLowerCase().replace(/[^a-z\?]/g, "");
  if (template.value !== cleanValue) {
    template.value = cleanValue;
  }
  displayWords();
}

function handleChangeLength() {
  const cleanValue = length.value.replace(/[^0-9]/g, "");
  if (length.value !== cleanValue) {
    length.value = cleanValue;
  }
  displayWords();
}

function handleChangeTray() {
  const cleanValue = tray.value.toLowerCase().replace(/[^a-z]/g, "");
  if (tray.value !== cleanValue) {
    tray.value = cleanValue;
  }
  displayWords();
}

template.addEventListener("keyup", handleChangeTemplate);

length.addEventListener("keyup", handleChangeLength);
length.addEventListener("change", handleChangeLength);

lengthType.forEach((input) => {
  input.addEventListener("change", displayWords);
});

tray.addEventListener("keyup", handleChangeTray);

trayType.forEach((input) => {
  input.addEventListener("change", displayWords);
});

setTimeout(() => {
  trie = getTrie(compressedTrie);
});
