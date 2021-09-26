// @ts-check

/** @typedef { import('../types.d').Article } Article */
/** @typedef { import('../types.d').ArticleList } ArticleList */

;(function() {

  'use strict';

  //
  // Variables
  //

  // Save the API endpoint
  const api = 'https://nyt.barker.workers.dev';

  // Save the sections to be fetched
  const sections = [ 'food', 'movies', 'technology' ];

  /** @type {HTMLDivElement} */
  const app = document.querySelector('#app');


  //
  // Functions
  //

  /**
   * Get the JSON data from a Fetch request
   * @param {Response} response The Response object
   * @returns {Promise<any>} The JSON data or an Error object
   */
  function getJSON(response) {
    // If the response was OK, return the JSON data
    if (response.ok) return response.json();

    // Otherwise, return an Error object
    const error = new Error('Try again later.');
    return Promise.reject(error);
  }

  /**
   * Get the JSON data for a single section
   * @param {string} section The section to fetch
   * @returns {Promise<ArticleList|Error>} The JSON data or an Error object
   */
  function fetchSection(section) {
    const options = { method: 'POST', body: section };
    return fetch(api, options).then(getJSON);
  }

  /**
   * Get the JSON data for all sections
   * @returns {Promise<PromiseSettledResult<ArticleList>[]>}
   */
  function getData() {
    const requests = sections.map(fetchSection);
    // @ts-ignore
    return Promise.allSettled(requests);
  }

  /**
   * Filter the fulfilled promises
   * @param {PromiseSettledResult<ArticleList>[]} promises The settled promises
   * @returns {ArticleList[]} The fulfilled promises
   */
  function getFulfilled(promises) {
    /** @type {PromiseFulfilledResult<ArticleList>[]} */
    const fulfilled = (
      promises.filter(result => result.status === 'fulfilled')
    );
    return fulfilled.map(result => result.value);
  }

  /**
   * Get the HTML string for a story
   * @param {Article} story A story from The New York Times
   * @returns {string} An HTML string
   */
  function getStoryHTML({ url, title, abstract }) {
    return `
      <article>
        <header>
          <h3>
            <a href="${url}">${title}</a>
          </h3>
        </header>
        <p>${abstract}</p>
      </article>
    `;
  }

  /**
   * Get the HTML string for a section of stories
   * @param {ArticleList} stories A list of stories from The New York Times
   * @returns {string} An HTML string
   */
  function getSectionHTML({ section, results }) {
    return `
      <article>
        <header>
          <h2>${section}</h2>
        </header>
        ${results.slice(0, 3).map(getStoryHTML).join('')}
      </article>
    `;
  }

  /**
   * Insert the stories into the DOM
   * @param {PromiseSettledResult<ArticleList>[]} data The API data
   * @returns {Promise<Error>} An Error object
   */
  function insertStories(data) {
    // Filter the fulfilled promises
    const fulfilled = getFulfilled(data);

    // If there are none, reject with an error
    if (fulfilled.length < 1) {
      /** @type {PromiseRejectedResult} */
      const rejected = (data[0]);
      return Promise.reject(rejected.reason);
    }

    // Otherwise, insert the stories into the DOM
    const htmlString = fulfilled.map(getSectionHTML).join('');
    app.innerHTML = DOMPurify.sanitize(htmlString);
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