const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()-_=+[]{};:,.?/";
const similarCharacters = /[il1Lo0O]/g;

const elements = {
  output: document.getElementById("passwordOutput"),
  length: document.getElementById("lengthRange"),
  lengthValue: document.getElementById("lengthValue"),
  lowercase: document.getElementById("lowercase"),
  uppercase: document.getElementById("uppercase"),
  numbers: document.getElementById("numbers"),
  symbols: document.getElementById("symbols"),
  avoidSimilar: document.getElementById("similarChars"),
  generate: document.getElementById("generateButton"),
  refresh: document.getElementById("refreshButton"),
  copy: document.getElementById("copyButton"),
  copyText: document.getElementById("copyText"),
  message: document.getElementById("validationMessage"),
  strength: document.getElementById("strengthLabel"),
  entropy: document.getElementById("entropyText"),
  bars: document.querySelector(".strength-bars"),
  toast: document.getElementById("toast"),
};

function secureIndex(size) {
  // Rejection sampling prevents modulo bias in the selected characters.
  const maxUnbiasedValue = 256 - (256 % size);
  const randomByte = new Uint8Array(1);

  do {
    crypto.getRandomValues(randomByte);
  } while (randomByte[0] >= maxUnbiasedValue);

  return randomByte[0] % size;
}

function secureChoice(characters) {
  return characters[secureIndex(characters.length)];
}

function selectedCharacterSets() {
  const removeSimilar = elements.avoidSimilar.checked;
  const clean = (set) => (removeSimilar ? set.replace(similarCharacters, "") : set);
  const sets = [];

  if (elements.lowercase.checked) sets.push(clean(lowercase));
  if (elements.uppercase.checked) sets.push(clean(uppercase));
  if (elements.numbers.checked) sets.push(clean(numbers));
  if (elements.symbols.checked) sets.push(symbols);
  return sets;
}

function shuffleSecurely(characters) {
  for (let index = characters.length - 1; index > 0; index -= 1) {
    const swapIndex = secureIndex(index + 1);
    [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
  }
  return characters;
}

function updateRangeFill() {
  const min = Number(elements.length.min);
  const max = Number(elements.length.max);
  const current = Number(elements.length.value);
  const percentage = ((current - min) / (max - min)) * 100;
  elements.length.style.background = `linear-gradient(90deg, #5ba376 0%, #5ba376 ${percentage}%, #d6ded8 ${percentage}%, #d6ded8 100%)`;
  elements.lengthValue.value = current;
}

function updateStrength(poolSize) {
  const length = Number(elements.length.value);
  const entropy = Math.round(length * Math.log2(poolSize));
  let level = 1;
  let label = "Weak";

  if (entropy >= 80) { level = 4; label = "Excellent"; }
  else if (entropy >= 60) { level = 3; label = "Strong"; }
  else if (entropy >= 40) { level = 2; label = "Fair"; }

  elements.strength.textContent = label;
  elements.entropy.textContent = `${entropy} bits`;
  elements.bars.className = `strength-bars level-${level}`;
  [...elements.bars.children].forEach((bar, index) => {
    bar.classList.toggle("active", index < level);
  });
}

function generatePassword() {
  const sets = selectedCharacterSets();
  const length = Number(elements.length.value);

  if (sets.length === 0) {
    elements.message.textContent = "Choose at least one character type.";
    elements.output.value = "";
    updateStrength(1);
    return;
  }

  elements.message.textContent = "";
  const allCharacters = sets.join("");
  const password = sets.map((set) => secureChoice(set));

  while (password.length < length) {
    password.push(secureChoice(allCharacters));
  }

  elements.output.value = shuffleSecurely(password).join("");
  updateStrength(allCharacters.length);
}

let toastTimer;
function showToast() {
  elements.toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2200);
}

async function copyPassword() {
  if (!elements.output.value) return;

  try {
    await navigator.clipboard.writeText(elements.output.value);
  } catch {
    elements.output.select();
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }

  elements.copyText.textContent = "Copied!";
  showToast();
  setTimeout(() => { elements.copyText.textContent = "Copy"; }, 1800);
}

elements.length.addEventListener("input", () => {
  updateRangeFill();
  generatePassword();
});

[
  elements.lowercase,
  elements.uppercase,
  elements.numbers,
  elements.symbols,
  elements.avoidSimilar,
].forEach((input) => input.addEventListener("change", generatePassword));

elements.generate.addEventListener("click", generatePassword);
elements.refresh.addEventListener("click", generatePassword);
elements.copy.addEventListener("click", copyPassword);

updateRangeFill();
generatePassword();
