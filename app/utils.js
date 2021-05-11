export const getTemplate = (template, prop) => {
  switch (template) {
    case "quote":
      return `
          <div class="quote p-4 m-4">
            <span class="quote-container">${prop}</span>
            <div class="actions flex flex-row">
              <div class="clipboard flex flex-row mt-4 mr-4 justify-end items-center text-gray-400 text-sm hover:text-gray-500 cursor-pointer transition-all duration-300 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy to clipboard
              </div>
              <div class="save flex flex-row mt-4 justify-end items-center text-gray-400 text-sm hover:text-gray-500 cursor-pointer transition-all duration-300 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save
              </div>
            </div>
          </div>
        `;
    case "saved-quote":
      return `
          <div class="savedQuote p-4 mb-4 rounded-md shadow-md bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" id="remove-from-saved" class="unsave h-5 w-5 text-purple-400 text-sm hover:text-red-400 cursor-pointer transition-all duration-300 ease-in-out" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span class="quote-container">${prop}</span>
          </div>
      `;
    case "copy-to-clipboard":
      return `
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy to clipboard
        `;
    case "copy-done":
      return `
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          Copied
        `;
    case "save":
      return `
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Save
        `;
    case "save-done":
      return `
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          Saved
        `;
    default:
      break;
  }
};

export const toClipboard = (quote) => {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(quote);
    }
  });
};

export const getSavedQuotes = () => {
  if (!localStorage.savedQuotes || !localStorage.savedQuotes.length) {
    localStorage.setItem("savedQuotes", "[]");
  }
  return JSON.parse(localStorage.getItem("savedQuotes"));
};

export const saveQuote = (quote) => {
  let savedQuotes = getSavedQuotes();
  savedQuotes.push(quote);
  localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
};

export const unsaveQuote = (index) => {
  let savedQuotes = getSavedQuotes();
  savedQuotes.splice(index, 1);
  localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
};
