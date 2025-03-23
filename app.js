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
  const clues = template.value;
  const len = length.value;
  const lenType = lengthType.find(({ checked }) => checked).value;
  const letters = tray.value;
  const lettersType = trayType.find(({ checked }) => checked).value;
  const words = [];
  const stack = [[trie, ""]];

  // TODO: finish adapting
  const pattern = wordWithBlanks;
  while (stack.length > 0) {
    const [currentNode, prefix] = stack.pop();
    if (currentNode.$ && prefix.length === pattern.length) {
      let isMatch = true;
      for (let i = 0; i < prefix.length; i++) {
        if (pattern[i] !== "?" && pattern[i] !== prefix[i]) {
          isMatch = false;
          break;
        }
        if (pattern[i] === "?" && !unusedLetters.includes(prefix[i])) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        words.push(prefix);
      }
    }
    if (prefix.length < pattern.length) {
      const nextPosition = prefix.length;
      const chars = Object.keys(currentNode).filter((key) => key !== "$");
      for (let i = chars.length - 1; i >= 0; i--) {
        const char = chars[i];
        if (pattern[nextPosition] !== "?" && pattern[nextPosition] !== char) {
          continue;
        }
        if (pattern[nextPosition] === "?" && !unusedLetters.includes(char)) {
          continue;
        }
        stack.push([currentNode[char], prefix + char]);
      }
    }
  }

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
