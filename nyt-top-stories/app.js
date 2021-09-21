;(function() {

  'use strict';

  //
  // Variables
  //

  // Save the API endpoint
  const api = 'https://nyt.barker.workers.dev';

  // Get the #app element
  const app = document.querySelector('#app');


  //
  // Functions
  //

  /**
   * Get the JSON data from a Fetch request
   * @param {Response} response The Response object
   * @returns {Promise} The JSON data or an Error object
   */
  function getJSON(response) {
    // If the response was OK, return the JSON data
    if (response.ok) return response.json();

    // Otherwise, return an Error object
    const error = new Error('Try again later.');
    return Promise.reject(error);
  }

  /**
   * Fetch the data from the API
   * @returns {Promise} The JSON data or an Error object
   */
  function getData() {
    return fetch(api).then(getJSON);
  }

  /**
   * Get the HTML string for a story
   * @param {Object} story The story data
   * @param {string} story.url The link to the story
   * @param {string} story.title The title of the story
   * @param {string} story.abstract The abstract for the story
   * @returns {string} An HTML string
   */
  function getStoryHTML({ url, title, abstract }) {
    return `
      <article>
        <header>
          <h2>
            <a href="${url}">${title}</a>
          </h2>
        </header>
        <p>${abstract}</p>
      </article>
    `;
  }

  /**
   * Insert the stories into the DOM
   * @param {Object} data The data returned by the API
   * @param {Array} data.results An array of stories
   */
  function insertStories({ results: stories }) {
    app.innerHTML = stories.map(getStoryHTML).join('');
  }

  /**
   * Handle errors
   * @param {Error} error An Error object
   */
  function handleError(error) {
    app.textContent = error.toString();
  }


  //
  // Inits & Event Listeners
  //

  // Fetch the stories and insert them into the DOM
  getData()
    .then(insertStories)
    .catch(handleError);

})();