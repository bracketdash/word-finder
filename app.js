const template = document.querySelector('input[name="template"]');
const length = document.querySelector('input[name="length"]');
const tray = document.querySelector('input[name="tray"]');

const lengthType = Array.from(
  document.querySelectorAll('input[name="lengthtype"]')
);

const trayType = Array.from(
  document.querySelectorAll('input[name="traytype"]')
);

const results = document.querySelector(".results");

let trie = {};

function displayWords() {
  // `clues` (string) is the known letters (lowercase a-z) of the word with "?" for unknown letters
  // `clues` can be completely blank for no restrictions
  // The left and right edges won't necessarily include "?" for each unknown letter
  // For example, "l?g" could lead to "log", "flog", "logs", etc. depending on other restrictions below
  const clues = template.value;
  // `len` (string) can be blank for no restriction, but if it has a value it will be a positive integer
  // `lenType` (string) controls what `len` means
  // if `lenType` is "exact", `len` represents the exact length of the word
  // if `lenType` is "min", `len` is the minimum length of the word
  // if `lenType` is "max", `len` is the maximum length of the word
  const len = length.value;
  const lenType = lengthType.find(({ checked }) => checked).value;
  // `letters` (string) can be blank for no restrictions as well, and if it has a value, will only consist of lowercase a-z
  // `lettersType` (string) controls what `letters` means
  // if `lettersType` is "some", words generated are restricted to just those that can be made with the letters in `letters` (plus any existing in `clues`)
  // if `lettersType` is "all", words are restricted to just those that can be made using ALL of the letters in `letters` (plus any existing in `clues`) but repeats are okay
  // if `lettersType` is "each", words are restricted to just those that can be made using ALL of the letters in `letters` (plus any existing in `clues`) exactly once
  // if `lettersType` is "none", words are restricted to just those that can be made WITHOUT any of the letters in `letters`
  const letters = tray.value;
  const lettersType = trayType.find(({ checked }) => checked).value;
  const words = [];
  // TODO: make possible words from `trie` (exists outside this function but is accessible)
  // Note: `trie` is a prefix trie with `{$: 1}` as the terminator
  // Example: { a: { d: { $: 1 }}} if "ad" was the only word in the trie
  let markup = "";
  words.slice(0, 100).forEach((word) => {
    markup += `<div>${word}</div>`;
  });
  results.innerHTML = markup;
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
