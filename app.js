;(function () {

  // Opt into ES5 strict mode
  "use strict";

  //
  // Variables
  //

  // The element to contain the stories
  var main = document.querySelector("main");

  // The endpoint and API key
  var endpoint = "https://api.nytimes.com/svc/topstories/v2/";
  var apiKey = "JraYD8iHz930GynlEnoalaAfNhBkCyUB";

  // The categories to fetch
  var categories = [ "food", "movies", "technology" ];

  //
  // Functions
  //

  /**
   * Get the JSON data from a Fetch request
   * @param   {Object} response The response to the Fetch request
   * @returns {Object}          The JSON data OR a rejected promise
   */
  function getJSON (response) {
    return response.ok ? response.json() : Promise.reject(response);
  }

  /**
   * Sanitize and encode all HTML in a user-submitted string
   * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {String} str  The user-submitted string
   * @return {String}      The sanitized string
   */
  function sanitizeHTML (str) {
    var temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   * Build the HTML string for a single story
   * @param   {Object} story The object returned by the API
   * @returns {String}       An HTML string
   */
  function buildStory (story) {

    // Sanitize the date here for readability
    var date = sanitizeHTML(story.updated_date);
  
    // Return the HTML string
    return (
      "<article>" +
        "<header>" +
          "<h3>" +
            "<a href='" + sanitizeHTML(story.url) + "'>" + sanitizeHTML(story.title) + "</a>" +
          "</h3>" +
          "<p>" +
            "<b>Last updated: </b>" +
            "<time datetime='" + date + "'>" +
              new Date(date).toLocaleString() +
            "</time>" +
          "</p>" +
        "</header>" +
        "<p>" + sanitizeHTML(story.abstract) + "</p>" +
      "</article>"
    );
  
  }

  /**
   * Build the HTML string for a single category
   * @param   {Array} stories An array of story objects
   * @returns {String}        An HTML string
   */
  function buildCategory (stories, category) {

    return (
      "<h2>" + category + "</h2>" +
      stories.slice(0, 3).map(buildStory).join("")
    );

  }

  /**
   * Return a Fetch request for the given category
   * @param   {String} category The category to use
   * @returns {String}          An HTML string
   */
  function fetchCategory (category) {

    return (
      fetch(endpoint + category + ".json?api-key=" + apiKey)
        .then(getJSON)
        .then(function (data) {
          return buildCategory(data.results, category);
        })
    );

  }

  /**
   * Join the category strings and add them to the DOM
   * @param {Array} categories The array of category strings
   */
  function showCategories (categories) {
    main.innerHTML = categories.join("");
  }

  /**
   * Add an error message to the DOM
   */
  function showError () {

    main.innerHTML = (
      "<p>" +
        "<strong>Sorry, there seems to be a problem. You can still view today's top stories on the <i>New York Times</i> website using the links above.</strong>" +
      "</p>"
    );

  }

  /**
   * Add all stories from all categories to the DOM
   */
  function getStories () {

    // Create an array of Fetch requests for the categories
    var requests = categories.map(fetchCategory);

    // This will resolve once ALL the requests have resolved
    var categoryStrings = Promise.all(requests);

    // Join the resolved array and add it to the DOM
    categoryStrings.then(showCategories).catch(showError);

  }


  //
  // Inits & Event Listeners
  //

  // Add all stories from all categories to the DOM
  getStories();

})();