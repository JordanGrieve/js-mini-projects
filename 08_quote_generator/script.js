const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterButton = document.getElementById("twitter");
const newQuoteButton = document.getElementById("new-quote");
const loader = document.querySelector(".loader");

let apiQuotes = [];

// loading function to show the loader
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

// complete function to hide the loader and show the quote container
function complete() {
  quoteContainer.hidden = false;
  loader.hidden = true;
}

// Show New Quote
function newQuote() {
  loading();
  // Pick a random quote from the apiQuotes array
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];

  authorText.textContent = quote.author ? quote.author : "Unknown";
  quoteText.textContent = quote.text;
  // Check quote length to determine styling
  if (quote.text.length > 120) {
    quoteText.classList.add("long-quote");
  } else {
    quoteText.classList.remove("long-quote");
  }
  // Set Quote, Hide Loader
  quoteText.textContent = quote.text;
  complete();
}

// Get Quote from API
async function getQuote() {
  loading();
  const apiUrl = "https://jacintodesign.github.io/quotes-api/data/quotes.json";
  try {
    const response = await fetch(apiUrl);
    apiQuotes = await response.json();
    console.log(apiQuotes);
    newQuote();
  } catch (error) {
    // Handle errors, such as network issues or API errors
    console.error("Error fetching quote:", error);
  }
}

// Tweet Quote
function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
  window.open(twitterUrl, "_blank");
}

// Event Listeners
newQuoteButton.addEventListener("click", newQuote);
twitterButton.addEventListener("click", tweetQuote);

// On Load
getQuote();
