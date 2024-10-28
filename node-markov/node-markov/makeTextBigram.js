/** Command-line tool to generate bigram Markov text.
 * 
 * This tool reads text from either a file or a URL and generates random text 
 * using a bigram-based Markov Chain model.
 * 
 * Usage:
 * node script.js file <file-path>   // Reads text from a file
 * node script.js url <url>          // Fetches text from a URL
 */

const fs = require("fs");          // Node.js module for file system operations (reading files).
const markov = require("./bigram"); // Import the Markov Machine class from the 'bigram' file.
const axios = require("axios");     // Axios library for making HTTP requests (fetching data from URLs).
const process = require("process"); // Node.js module to interact with the system's command-line processes.


/** Make Markov machine from text and generate random text.
 * 
 * @param {string} text - The input text to be processed by the Markov Machine.
 * This function takes the input text, creates a Markov Machine instance,
 * and then generates random text from it using the makeText() method.
 */
function generateText(text) {
  // Create a new MarkovMachine instance from the input text.
  let mm = new markov.MarkovMachine(text);
  // Generate random text using the Markov chain and output it to the console.
  console.log(mm.makeText());
}


/** Read file from the specified path and generate Markov text.
 * 
 * @param {string} path - The file path from which to read the input text.
 * This function reads the content of a file asynchronously. If the file is 
 * successfully read, the text is passed to the generateText() function to create 
 * Markov-based random text. If there's an error reading the file, it logs the error 
 * and exits the process.
 */
function makeText(path) {
  // Asynchronously read the file at the specified path using UTF-8 encoding.
  fs.readFile(path, "utf8", function cb(err, data) {
    if (err) {
      // If there's an error, log it and exit the process with a non-zero status code.
      console.error(`Cannot read file: ${path}: ${err}`);
      process.exit(1);
    } else {
      // If the file is successfully read, pass the content to generateText().
      generateText(data);
    }
  });
}


/** Fetch content from the specified URL and generate Markov text.
 * 
 * @param {string} url - The URL to fetch text from.
 * This function fetches text from the provided URL using Axios. If the content is 
 * successfully retrieved, it is passed to the generateText() function to create 
 * Markov-based random text. If there's an error fetching the URL, it logs the error 
 * and exits the process.
 */
async function makeURLText(url) {
  let resp;

  try {
    // Make an HTTP GET request to the specified URL.
    resp = await axios.get(url);
  } catch (err) {
    // If there's an error fetching the URL, log it and exit the process with a non-zero status code.
    console.error(`Cannot read URL: ${url}: ${err}`);
    process.exit(1);
  }
  // If the request is successful, pass the response data (text) to generateText().
  generateText(resp.data);
}


/** Interpret command-line arguments to decide whether to read from a file or URL.
 * 
 * The script expects two command-line arguments:
 * 1. The method ("file" or "url") indicating the input type.
 * 2. The path or URL from which to read the input text.
 * 
 * Based on the provided method, it calls either makeText (for files) or 
 * makeURLText (for URLs). If an unknown method is specified, it logs an error and exits.
 */

// Extract command-line arguments (ignoring "node" and script name).
let [method, path] = process.argv.slice(2);

// If the method is "file", call makeText() to read and process text from a file.
if (method === "file") {
  makeText(path);
}

// If the method is "url", call makeURLText() to fetch and process text from a URL.
else if (method === "url") {
  makeURLText(path);
}

// If the method is neither "file" nor "url", log an error and exit with a non-zero status code.
else {
  console.error(`Unknown method: ${method}`);
  process.exit(1);
}
