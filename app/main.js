import "../styles/styles.scss";
import { dictionary, dictionaryAlt } from "./dictionary.js";

// Useful functions that do not directly influence the logic of the program
import {
  getTemplate,
  toClipboard,
  getSavedQuotes,
  saveQuote,
  unsaveQuote,
} from "./utils.js";

// Generate the quote from the selected dictionary
const generateSentence = (dictionary) => {
  let blocks = [];

  dictionary.forEach((block) => {
    let selected = block[Math.floor(Math.random() * block.length)];
    blocks.push(selected);
  });

  /*
    Returns the generated quote properly formatted (spaces, aprostrophe, etc...)
    using the formatBloks() function just below.
  */
  return formatBlocks(blocks);
};

// Format quote
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

// All html templates are generated with this function "getTemplate()" available in utils.js
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

/*
  Returns all the requested quotes taking into account the number and the source.
  Injects them into the html
*/
const getQuotes = (element, numberOfQuotes, source) => {
  element.innerHTML = "";
  for (let i = 0; i < numberOfQuotes; i++) {
    fillQuote(element, generateSentence(getSource(source)));
  }
};

// Filter saved quotes
const filterQuote = (filterValue, quotes) => {
  return quotes.filter((quote) =>
    quote.toUpperCase().includes(filterValue.toUpperCase())
  );
};

/*
  Initialization of the script. The use of jQuery allows to wait for
  the DOM and the object document to be properly loaded and accessible.
*/
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
  let unsave = document.querySelectorAll(".remove-from-saved");
  let numberOfQuotes = 1;
  let filteredquotes = [];

  // First display of saved quotes
  let savedQuotes = getSavedQuotes();
  fillSavedQuotes(savedContainer, savedQuotes);

  // displays or hides the saved quotes container
  if (savedQuotes && savedQuotes.length <= 0) {
    saveContainer.style.opacity = 0;
  } else {
    saveContainer.style.opacity = 1;
  }

  // Manage listener events for deleting and re-displaying saved quotes
  let removeFromSaved = (savedContainer) => {
    unsave = document.querySelectorAll(".remove-from-saved");
    unsave.forEach((quote, index) => {
      quote.addEventListener("click", () => {
        // This function is available in utils.js
        unsaveQuote(index);
        savedQuotes = getSavedQuotes();
        fillSavedQuotes(savedContainer, savedQuotes);

        setTimeout(() => {
          removeFromSaved(savedContainer);
        }, 200);

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

  // Select classic collection
  classicCollec.addEventListener("click", () => {
    if (classicCollec.classList.contains("active")) return;
    source = "classic";
    loremCollec.classList.remove("active");
    classicCollec.classList.add("active");
    getQuotes(quotesContainer, numberOfQuotes, source);
    randomizeButton.style.display = "flex";
  });

  // Select lorem collection
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
    removeFromSaved(savedContainer);
  });

  resetInput.addEventListener("click", () => {
    filterInput.value = "";
    resetInput.style.opacity = 0;
    filteredquotes = filterQuote(filterInput.value, savedQuotes);
    fillSavedQuotes(savedContainer, filteredquotes);
    removeFromSaved(savedContainer);
  });

  rangeInput.addEventListener("input", () => {
    randomizeButton.style.display = "flex";
    rangeValue.value = rangeInput.value;
    numberOfQuotes = rangeInput.value;
    getQuotes(quotesContainer, numberOfQuotes, source);
  });

  /*
    A set of actions are triggered by pressing the validate button :
    - Set actions buttons visible
    - Initialize events listeners of all these actions
  */
  validateButton.addEventListener("click", () => {
    randomizeButton.style.display = "none";
    const actions = document.querySelectorAll(".actions");
    const clipboards = document.querySelectorAll(".clipboard");
    const save = document.querySelectorAll(".save");
    const quote = document.querySelectorAll(".quote");
    const quoteContent = document.querySelectorAll(".quote-container");

    // Set actions buttons visible
    for (let el of actions) {
      el.classList.add("visible");
    }
    for (let el of quote) {
      el.classList.add("isDone");
    }

    // Initialize events listeners of clipboards
    clipboards.forEach((quote, index) => {
      quote.addEventListener("click", () => {
        clipboards[index].innerHTML = getTemplate("copy-done");
        setTimeout(() => {
          clipboards[index].innerHTML = getTemplate("copy-to-clipboard");
        }, 2500);
        toClipboard(quoteContent[index].innerHTML);
      });
    });

    // Initialize events listeners of save quote
    save.forEach((quote, index) => {
      quote.addEventListener("click", () => {
        if (quoteContent[index]) {
          quote.innerHTML = getTemplate("save-done");
          saveQuote(quoteContent[index].innerHTML);
          savedQuotes = getSavedQuotes();
          fillSavedQuotes(savedContainer, savedQuotes);

          setTimeout(() => {
            removeFromSaved(savedContainer);
          }, 200);

          if (savedQuotes && savedQuotes.length <= 0) {
            saveContainer.style.opacity = 0;
          } else {
            saveContainer.style.opacity = 1;
          }
        }
      });
    });
  });

  // First display of quotes
  getQuotes(quotesContainer, numberOfQuotes, source);

  // Event listener of randomize button
  randomizeButton.addEventListener("click", () => {
    getQuotes(quotesContainer, numberOfQuotes, source);
  });
});
