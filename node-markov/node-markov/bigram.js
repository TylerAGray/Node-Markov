/** Textual markov chain generator using bigrams. */

class MarkovMachine {

  /** build markov machine; read in text.
   * 
   * @param {string} text - The input text to be processed into a Markov Chain.
   * Splits the input text into words and filters out empty spaces/new lines.
   * Then, it generates the Markov Chain by calling makeChains().
   */

  constructor(text) {
    // Split the input text into an array of words, using spaces or newlines as delimiters.
    let words = text.split(/[ \r\n]+/);
    // Filter out any empty strings from the words array (caused by multiple spaces or newlines).
    this.words = words.filter(c => c !== "");
    // Create the Markov chains based on the array of words.
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the cat": ["in"], "cat in": ["the"], "in the": ["hat"], "the hat": [null]} */

  makeChains() {
    let chains = new Map();  // Initialize an empty Map to store the chains.

    // Loop through the words array and create bigrams (pairs of words).
    for (let i = 0; i < this.words.length - 1; i += 1) {
      // Create a bigram by concatenating the current word and the next word.
      let bigram = this.words[i] + " " + this.words[i + 1];
      // Identify the word that follows the bigram. If no word follows, set it to `null`.
      let nextWord = this.words[i + 2] || null;

      // If the bigram already exists in the chains map, append the next word to its array.
      if (chains.has(bigram)) chains.get(bigram).push(nextWord);
      // Otherwise, add the bigram to the map with the next word in an array.
      else chains.set(bigram, [nextWord]);
    }

    // Store the created chains map as a property of the MarkovMachine instance.
    this.chains = chains;
  }


  /** Pick random choice from array */

  choice(ar) {
    return ar[Math.floor(Math.random() * ar.length)];
  }


  /** return random text from chains */

  makeText(numWords = 100) {
    // Get an array of all bigram keys (starting points) from the chains map.
    let keys = Array.from(this.chains.keys());
    // Randomly choose a starting bigram key.
    let key = this.choice(keys);
    // Initialize an empty array to store the generated words.
    let out = [];

   // Loop until we've generated the desired number of words or hit a termination condition.
        while (out.length <= numWords && key !== null) {
   // Split the current bigram into two words.
          let [w1, w2] = key.split(" ");
   // Add the first word of the bigram to the output array.
   out.push(w1);
    // Create a new bigram using the second word of the previous bigram and a random word 
    // from the array of possible next words in the chains map.
    key = w2 + " " + this.choice(this.chains.get(key));
      }

    // Return the generated words as a single string, joined by spaces.
    return out.join(" ");
  }
}


// Export the MarkovMachine class for use in other files.
module.exports = {
  MarkovMachine,
};
