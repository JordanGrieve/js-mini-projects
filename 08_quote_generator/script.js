let apiQuotes = [];

// Show New Quote
function newQuote() {
  // Pick a random quote from the apiQuotes array
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  console.log(quote);
}

// Get Quote from API
async function getQuote() {
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

// On Load
getQuote();
