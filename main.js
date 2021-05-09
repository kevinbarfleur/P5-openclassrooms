import "./styles/styles.scss";
import { dictionary, dictionaryAlt } from "./dictionary.js";

const generateSentence = (dictionary) => {
  let blocks = [];

  dictionary.forEach((block) => {
    let selected = block[Math.floor(Math.random() * block.length)];
    blocks.push(selected);
  });

  return formatBlocks(blocks);
};

const formatBlocks = (blocks) => {
  const vowel = "aeiouyhéè";
  if (blocks[3].charAt(blocks[3].length - 1) === "#") {
    let isVowel = false;
    blocks[3] = blocks[3].slice(0, -1);

    for (let i = 0; i < vowel.length; i++) {
      if (blocks[4].charAt(0) == vowel.charAt(i)) {
        isVowel = true;
      }
    }

    if (isVowel) {
      blocks[3] += "'";
    } else {
      blocks[3] += "e ";
    }
  } else {
    blocks[3] += " ";
  }

  return blocks.join(" ");
};

const quoteTemplate = (quote) => {
  return `
    <div class="quote p-4 m-4">${quote}</div>
  `;
};

const fillQuote = (container, quote) => {
  let currentQuote = "";

  for (let block of quote) {
    currentQuote += block;
  }

  container.innerHTML += quoteTemplate(currentQuote);
};

const getSource = (select) => {
  return select.value === "classic" ? dictionary : dictionaryAlt;
};

const getQuotes = (element, numberOfQuotes, source) => {
  element.innerHTML = "";
  for (let i = 0; i < numberOfQuotes; i++) {
    fillQuote(element, generateSentence(getSource(source)));
  }
};

$(function () {
  const quotesContainer = document.querySelector(".quotes-container");
  const randomizeButton = document.querySelector(".randomize-button");
  const rangeValue = document.querySelector("#rangevalue");
  const rangeInput = document.querySelector(".range");
  const source = document.querySelector(".collections-select");
  let numberOfQuotes = 1;

  rangeInput.value = numberOfQuotes;
  rangeValue.value = numberOfQuotes;

  rangeInput.addEventListener("input", () => {
    rangeValue.value = rangeInput.value;
    numberOfQuotes = rangeInput.value;
  });

  source.addEventListener("input", () => {
    getQuotes(quotesContainer, numberOfQuotes, source);
  });

  getQuotes(quotesContainer, numberOfQuotes, source);

  randomizeButton.addEventListener("click", () => {
    getQuotes(quotesContainer, numberOfQuotes, source);
  });
});
