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
    <div class="quote p-4 m-4">
      <span class="quote-container">${quote}</span>
      <div class="clipboard flex flex-row mt-4 justify-end items-center text-gray-400 text-sm hover:text-gray-500 cursor-pointer transition-all duration-300 ease-in-out">
      <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
      </svg>
      copy to clipboard
      </div>
    </div>
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

const toClipboard = (quote) => {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(quote);
    }
  });
};

$(function () {
  const quotesContainer = document.querySelector(".quotes-container");
  const randomizeButton = document.querySelector(".randomize-button");
  const validateButton = document.querySelector(".validate-button");
  const rangeValue = document.querySelector("#rangevalue");
  const rangeInput = document.querySelector(".range");
  const source = document.querySelector(".collections-select");
  let numberOfQuotes = 1;

  rangeInput.value = numberOfQuotes;
  rangeValue.value = numberOfQuotes;

  rangeInput.addEventListener("input", () => {
    randomizeButton.style.display = "flex";
    rangeValue.value = rangeInput.value;
    numberOfQuotes = rangeInput.value;
    getQuotes(quotesContainer, numberOfQuotes, source);
  });

  source.addEventListener("input", () => {
    randomizeButton.style.display = "flex";
    getQuotes(quotesContainer, numberOfQuotes, source);
  });

  validateButton.addEventListener("click", () => {
    randomizeButton.style.display = "none";
    const clipboards = document.querySelectorAll(".clipboard");
    const quote = document.querySelectorAll(".quote");
    const quoteContent = document.querySelectorAll(".quote-container");

    for (let el of clipboards) {
      el.classList.add("visible");
    }
    for (let el of quote) {
      el.classList.add("isDone");
    }

    clipboards.forEach((quote, index) => {
      quote.addEventListener("click", () => {
        toClipboard(quoteContent[index].innerHTML);
      });
    });
  });

  getQuotes(quotesContainer, numberOfQuotes, source);

  randomizeButton.addEventListener("click", () => {
    getQuotes(quotesContainer, numberOfQuotes, source);
  });
});
