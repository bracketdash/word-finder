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

let trie = [];

const MAX_WORDS = 100;

function removeMatchedLetters(word, pattern, lettersToRemove) {
  const match = pattern.exec(word);
  const matchIndex = match.index;
  const matchedPortion = match[0];
  const chars = word.split("");
  let searchStartIndex = 0;
  for (let i = 0; i < lettersToRemove.length; i++) {
    const letterToRemove = lettersToRemove[i];
    const letterPosition = matchedPortion.indexOf(
      letterToRemove,
      searchStartIndex
    );
    if (letterPosition !== -1) {
      const actualPosition = matchIndex + letterPosition;
      if (chars[actualPosition] === letterToRemove) {
        chars[actualPosition] = "";
      }
      searchStartIndex = letterPosition + 1;
    }
  }
  const cleanChars = chars.join("").split("");
  return cleanChars;
}

function displayWords() {
  const clues = template.value;
  const pattern = new RegExp(clues.replaceAll("?", "."));
  const lettersToRemove = clues.replaceAll("?", "").split("");
  let len = parseInt(length.value, 10);
  if (isNaN(len)) {
    len = false;
  }
  const lenType = lengthType.find(({ checked }) => checked).value;
  const letters = tray.value.split("");
  const lettersType = trayType.find(({ checked }) => checked).value;
  const words = [];
  const stack = [[trie, ""]];
  while (stack.length > 0) {
    const [currentNode, prefix] = stack.pop();
    if (
      currentNode.$ &&
      pattern.test(prefix) &&
      (!len ||
        (lenType === "exact" && prefix.length === len) ||
        (lenType === "min" && prefix.length >= len) ||
        (lenType === "max" && prefix.length <= len))
    ) {
      if (letters.length) {
        let sansClues = prefix;
        if (lettersToRemove.length) {
          sansClues = removeMatchedLetters(prefix, pattern, lettersToRemove);
        }
        switch (lettersType) {
          case "somere":
            if (!sansClues.some((c) => !letters.includes(c))) {
              words.push(prefix);
            }
            break;
          case "someno":
            // TODO: Can use some or all, no repeats
            break;
          case "allre":
            if (
              letters.every((c) => sansClues.includes(c)) &&
              !sansClues.some((c) => !letters.includes(c))
            ) {
              words.push(prefix);
            }
            break;
          case "allno":
            if (
              !letters.reduce((r, c) => r.replace(c, ""), sansClues.join(""))
                .length
            ) {
              words.push(prefix);
            }
            break;
          case "none":
            if (!sansClues.some((c) => letters.includes(c))) {
              words.push(prefix);
            }
            break;
        }
      } else {
        words.push(prefix);
      }
    }
    if (
      words.length < MAX_WORDS &&
      (!len || lenType === "min" || prefix.length <= len)
    ) {
      const chars = Object.keys(currentNode).filter((key) => key !== "$");
      for (let i = chars.length - 1; i >= 0; i--) {
        const char = chars[i];
        stack.push([currentNode[char], prefix + char]);
      }
    }
  }
  let markup = "";
  words.forEach((word) => {
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
  const cleanValue = template.value.toLowerCase().replace(/[^a-z]/g, "?");
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
  if (cleanValue.length) {
    lengthfieldset.className = "open";
  } else {
    lengthfieldset.className = "closed";
  }
  displayWords();
}

function handleChangeTray() {
  const cleanValue = tray.value.toLowerCase().replace(/[^a-z]/g, "");
  if (tray.value !== cleanValue) {
    tray.value = cleanValue;
  }
  if (cleanValue.length) {
    trayfieldset.className = "open";
  } else {
    trayfieldset.className = "closed";
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
