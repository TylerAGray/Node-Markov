/** Textual Markov Chain generator
 * 
 * This class generates random text based on a Markov Chain, using individual words 
 * as the "states" of the chain. It builds the chain from input text and can then 
 * generate random sequences of words based on this chain.
 */

class MarkovMachine {

  /** Build Markov machine; read in text.
   * 
   * @param {string} text - The input text to be processed into a Markov chain.
   * The constructor splits the text into words, filters out any empty elements (e.g., 
   * extra spaces or newlines), and then calls `makeChains()` to build the Markov chain.
   */
  
  constructor(text) {
    // Split the input text into an array of words, using spaces or newlines as delimiters.
    let words = text.split(/[ \r\n]+/);
    // Filter out any empty strings from the words array.
    this.words = words.filter(c => c !== "");
    // Build the Markov chain using the array of words.
    this.makeChains();
  }

  /** Set Markov chains:
   *
   * For a text like "the cat in the hat", this method creates a map of words and the possible 
   * words that follow them.
   * Example:
   * {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]}
   * 
   * The key is a word, and the value is an array of possible words that can come after it 
   * in the text. If no word follows, it's set to `null`.
   */
  
  makeChains() {
    // Initialize an empty Map to store the Markov chains.
    let chains = new Map();

    // Loop through the words array to build the chain.
    for (let i = 0; i < this.words.length; i += 1) {
      let word = this.words[i];           // Current word.
      let nextWord = this.words[i + 1] || null; // Next word, or null if at the end of the text.

      // If the word is already a key in the map, add the next word to its list of followers.
      if (chains.has(word)) chains.get(word).push(nextWord);
      // Otherwise, add the word to the map with the next word in an array.
      else chains.set(word, [nextWord]);
    }

    // Store the chains map as a property of the MarkovMachine instance.
    this.chains = chains;
  }


  /** Pick a random choice from an array.
   * 
   * This is a utility function to select a random element from an array.
   * @param {Array} ar - The array from which to select a random element.
   * @return A random element from the input array.
   */
  
  static choice(ar) {
    // Math.random() generates a random number between 0 and 1. Multiplying it by the array 
    // length ensures we get a valid index. Math.floor() rounds down to the nearest whole number.
    return ar[Math.floor(Math.random() * ar.length)];
  }


  /** Generate random text based on the Markov chains.
   * 
   * This method generates a sequence of words by following the Markov chain from one word 
   * to the next. It starts with a randomly chosen word and continues selecting the next word 
   * based on the chain until the desired number of words is reached, or no more words follow.
   * 
   * @param {number} numWords - The maximum number of words to generate (default is 100).
   * @return {string} - A string of randomly generated text.
   */
  
  makeText(numWords = 100) {
    // Get an array of all the keys (starting words) from the chains map.
    let keys = Array.from(this.chains.keys());
    // Randomly select a starting word (key) from the chains.
    let key = MarkovMachine.choice(keys);
    // Initialize an empty array to store the generated words.
    let out = [];

    // Keep adding words to the output array until the desired number of words is reached
    // or we encounter a null (meaning there are no more words to follow).
    while (out.length < numWords && key !== null) {
      out.push(key);  // Add the current word to the output array.
      key = MarkovMachine.choice(this.chains.get(key)); // Choose the next word from the chain.
    }

    // Return the generated words as a single string, with spaces between them.
    return out.join(" ");
  }
}


// Export the MarkovMachine class for use in other files.
module.exports = {
  MarkovMachine,
};
