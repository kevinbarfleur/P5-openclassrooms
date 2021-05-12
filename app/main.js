import "../styles/styles.scss";
import { dictionary, dictionaryAlt } from "./dictionary.js";
import {
  getTemplate,
  toClipboard,
  getSavedQuotes,
  saveQuote,
  unsaveQuote,
} from "./utils.js";

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
  return getTemplate("quote", quote);
};

const fillQuote = (container, quote) => {
  let currentQuote = "";

  for (let block of quote) {
    currentQuote += block;
  }

  container.innerHTML += quoteTemplate(currentQuote);
};

const fillSavedQuotes = (container, savedQuote) => {
  container.innerHTML = "";
  for (let quote of savedQuote) {
    container.innerHTML += getTemplate("saved-quote", quote);
  }
};

const getSource = (value) => {
  return value === "classic" ? dictionary : dictionaryAlt;
};

const getQuotes = (element, numberOfQuotes, source) => {
  element.innerHTML = "";
  for (let i = 0; i < numberOfQuotes; i++) {
    fillQuote(element, generateSentence(getSource(source)));
  }
};

const filterQuote = (filterValue, quotes) => {
  return quotes.filter((quote) =>
    quote.toUpperCase().includes(filterValue.toUpperCase())
  );
};

$(function () {
  const quotesContainer = document.querySelector(".quotes-container");
  const savedContainer = document.querySelector(".save");
  const randomizeButton = document.querySelector(".randomize-button");
  const validateButton = document.querySelector(".validate-button");
  const saveContainer = document.querySelector(".save-separator");
  const rangeValue = document.querySelector("#rangevalue");
  const rangeInput = document.querySelector(".range");
  const resetInput = document.querySelector(".reset-input");
  const filterInput = document.querySelector(".filter-input");
  const classicCollec = document.querySelector(".collections-classic");
  const loremCollec = document.querySelector(".collections-lorem");
  let source = "classic";
  let unsave = document.querySelectorAll("#remove-from-saved");
  let numberOfQuotes = 1;
  let filteredquotes = [];

  let savedQuotes = getSavedQuotes();
  fillSavedQuotes(savedContainer, savedQuotes);

  if (savedQuotes && savedQuotes.length <= 0) {
    saveContainer.style.opacity = 0;
  } else {
    saveContainer.style.opacity = 1;
  }

  let removeFromSaved = (savedContainer) => {
    unsave = document.querySelectorAll("#remove-from-saved");
    unsave.forEach((quote, index) => {
      quote.addEventListener("click", () => {
        unsaveQuote(index);
        savedQuotes = getSavedQuotes();
        fillSavedQuotes(savedContainer, savedQuotes);
        removeFromSaved(savedContainer);

        if (savedQuotes && savedQuotes.length <= 0) {
          saveContainer.style.opacity = 0;
        } else {
          saveContainer.style.opacity = 1;
        }
      });
    });
  };
  removeFromSaved(savedContainer);

  rangeInput.value = numberOfQuotes;
  rangeValue.value = numberOfQuotes;

  classicCollec.addEventListener("click", () => {
    if (classicCollec.classList.contains("active")) return;
    source = "classic";
    loremCollec.classList.remove("active");
    classicCollec.classList.add("active");
    getQuotes(quotesContainer, numberOfQuotes, source);
    randomizeButton.style.display = "flex";
  });

  loremCollec.addEventListener("click", () => {
    if (loremCollec.classList.contains("active")) return;
    source = "lorem";
    classicCollec.classList.remove("active");
    loremCollec.classList.add("active");
    getQuotes(quotesContainer, numberOfQuotes, source);
    randomizeButton.style.display = "flex";
  });

  filterInput.addEventListener("input", () => {
    if (filterInput.value || filterInput.value.length) {
      resetInput.style.opacity = 1;
    } else {
      resetInput.style.opacity = 0;
    }

    filteredquotes = filterQuote(filterInput.value, savedQuotes);
    fillSavedQuotes(savedContainer, filteredquotes);
  });

  resetInput.addEventListener("click", () => {
    filterInput.value = "";
    resetInput.style.opacity = 0;
    filteredquotes = filterQuote(filterInput.value, savedQuotes);
    fillSavedQuotes(savedContainer, filteredquotes);
  });

  rangeInput.addEventListener("input", () => {
    randomizeButton.style.display = "flex";
    rangeValue.value = rangeInput.value;
    numberOfQuotes = rangeInput.value;
    getQuotes(quotesContainer, numberOfQuotes, source);
  });

  validateButton.addEventListener("click", () => {
    randomizeButton.style.display = "none";
    const actions = document.querySelectorAll(".actions");
    const clipboards = document.querySelectorAll(".clipboard");
    const save = document.querySelectorAll(".save");
    const quote = document.querySelectorAll(".quote");
    const quoteContent = document.querySelectorAll(".quote-container");

    for (let el of actions) {
      el.classList.add("visible");
    }
    for (let el of quote) {
      el.classList.add("isDone");
    }

    clipboards.forEach((quote, index) => {
      quote.addEventListener("click", () => {
        clipboards[index].innerHTML = getTemplate("copy-done");
        setTimeout(() => {
          clipboards[index].innerHTML = getTemplate("copy-to-clipboard");
        }, 2500);
        toClipboard(quoteContent[index].innerHTML);
      });
    });

    save.forEach((quote, index) => {
      quote.addEventListener("click", () => {
        if (quoteContent[index]) {
          quote.innerHTML = getTemplate("save-done");
          saveQuote(quoteContent[index].innerHTML);
          savedQuotes = getSavedQuotes();
          fillSavedQuotes(savedContainer, savedQuotes);

          removeFromSaved(savedContainer);

          if (savedQuotes && savedQuotes.length <= 0) {
            saveContainer.style.opacity = 0;
          } else {
            saveContainer.style.opacity = 1;
          }
        }
      });
    });
  });

  getQuotes(quotesContainer, numberOfQuotes, source);

  randomizeButton.addEventListener("click", () => {
    getQuotes(quotesContainer, numberOfQuotes, source);
  });
});
