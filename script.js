// script.js
const quotesLocal = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" }
];

const elQuote = document.getElementById('quote-text');
const elAuthor = document.getElementById('quote-author');
const btnNew = document.getElementById('new-quote');
const btnTweet = document.getElementById('tweet-quote');

function pickLocalQuote() {
  const idx = Math.floor(Math.random() * quotesLocal.length);
  return quotesLocal[idx];
}

async function fetchQuoteFromAPI() {
  // Using quotable.io as a lightweight, CORS-friendly fallback API
  // If offline or API fails, we fall back to local quotes.
  try {
    const r = await fetch('https://api.quotable.io/random?maxLength=140');
    if (!r.ok) throw new Error('API response not ok');
    const data = await r.json();
    return { text: data.content, author: data.author || 'Unknown' };
  } catch (e) {
    console.warn('API fetch failed, using local quotes.', e);
    return null;
  }
}

async function displayQuote() {
  // try API then fallback to local
  elQuote.style.opacity = 0;
  elAuthor.style.opacity = 0;

  // small delay for fade effect
  setTimeout(async () => {
    const apiQuote = await fetchQuoteFromAPI();
    const { text, author } = apiQuote || pickLocalQuote();
    elQuote.textContent = `“${text}”`;
    elAuthor.textContent = `— ${author}`;
    elQuote.style.opacity = 1;
    elAuthor.style.opacity = 1;
  }, 180);
}

btnNew.addEventListener('click', displayQuote);

btnTweet.addEventListener('click', () => {
  const text = elQuote.textContent + ' ' + elAuthor.textContent;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener');
});

// show first quote on load
displayQuote();
