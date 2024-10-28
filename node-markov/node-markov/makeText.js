/** Command-line tool to generate Markov text.
 * 
 * This tool reads text from either a file or a URL and then generates random text 
 * using a Markov Chain model, built with bigrams.
 */

const fs = require("fs");         // Node.js module for reading/writing files.
const markov = require("./markov"); // Importing the Markov Machine class from markov.js.
const axios = require("axios");     // Axios library for making HTTP requests to fetch URL content.
const process = require("process"); // Node.js module for interacting with the system's process (command-line arguments).

/** Make Markov machine from text and generate text from it.
 * 
 * @param {string} text - The input text to generate Markov-based random text from.
 * This function takes input text, creates an instance of the MarkovMachine, 
 * and then uses it to generate and print random text.
 */
function generateText(text) {
  // Create a new MarkovMachine instance using the input text.
  let mm = new markov.MarkovMachine(text);
  // Generate and log the random text to the console.
  console.log(mm.makeText());
}


/** Read file and generate text from it.
 * 
 * @param {string} path - The file path to read text from.
 * This function reads a file asynchronously, and if the file is read successfully, 
 * it generates random text using the generateText function. 
 * If there's an error (e.g., file not found), it logs the error and exits the process.
 */
function makeText(path) {
  // Asynchronously read the file at the given path, expecting UTF-8 encoded content.
  fs.readFile(path, "utf8", function cb(err, data) {
    if (err) {
      // If there's an error reading the file, log it and exit with an error code.
      console.error(`Cannot read file: ${path}: ${err}`);
      process.exit(1);
    } else {
      // If the file is read successfully, generate Markov-based text.
      generateText(data);
    }
  });
}


/** Read URL and generate text from it.
 * 
 * @param {string} url - The URL to fetch text from.
 * This function uses Axios to fetch text from a given URL asynchronously.
 * If the request is successful, it generates random text using the generateText function.
 * In case of an error (e.g., network issues, invalid URL), it logs the error and exits the process.
 */
async function makeURLText(url) {
  let resp;

  try {
    // Use Axios to make a GET request to the given URL.
    resp = await axios.get(url);
  } catch (err) {
    // If there's an error fetching the URL (e.g., 404 or network error), log it and exit.
    console.error(`Cannot read URL: ${url}: ${err}`);
    process.exit(1);
  }
  // If the URL content is fetched successfully, generate Markov-based text.
  generateText(resp.data)
}


/** Interpret command-line arguments to decide what to do.
 * 
 * This block of code interprets command-line arguments to decide whether to
 * read from a file or a URL, based on the first argument. It then calls 
 * the appropriate function (makeText for files, makeURLText for URLs).
 * 
 * Usage:
 * node script.js file <file-path>
 * node script.js url <url>
 */

// Extract command-line arguments (ignoring "node" and script name).
let [method, path] = process.argv.slice(2);

// If the user specifies "file", call makeText to read from the file system.
if (method === "file") {
  makeText(path);
}

// If the user specifies "url", call makeURLText to fetch content from a URL.
else if (method === "url") {
  makeURLText(path);
}

// If the user provides an unknown method, log an error and exit.
else {
  console.error(`Unknown method: ${method}`);
  process.exit(1);
}
