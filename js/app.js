;(function(d) {

  "use strict";

  /**
   * Variables
   */

  var endpoint = "https://api.nytimes.com/svc/topstories/v2/";
  var apiKey = "JraYD8iHz930GynlEnoalaAfNhBkCyUB";
  var categories = [ "movies", "science", "technology" ];
  var app = d.querySelector("#app");



  /**
   * Functions
   */

  /**
   * Sanitize and encode all HTML in a user-submitted string
   * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {String} str  The user-submitted string
   * @return {String}      The sanitized string
   */
  function sanitizeHTML(str) {
    var temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   * Get the JSON from a fetch request
   * @param  {Object} response The response from the fetch request
   * @return {Object}          The parsed JSON object
   */
  function getJSON(response) {
    return (response.ok) ? response.json() : Promise.reject(response);
  }

  /**
   * Build the HTML for an article
   * @param  {Object} story The object representing the current article
   * @return {String}       An HTML string for the article
   */
  function buildArticle(story) {
    return (
      "<article class='mb4 georgia'>" +
        "<header>" +
          "<h3 class='lh-title measure'>" +
            "<a href='" + sanitizeHTML(story.url) + "'>" +
              sanitizeHTML(story.title) +
            "</a>" +
          "</h3>" +
        "</header>" +
        "<p class='lh-copy measure'>" +
          sanitizeHTML(story.byline) +
        "</p>" +
        "<p class='lh-copy measure'>" +
          sanitizeHTML(story.abstract) +
        "</p>" +
      "</article>"
    );
  }

  /**
   * Insert the HTML for all articles of a specific category into the DOM
   * @param {Array}  articles An array of objects for each article
   * @param {String} category The category to use
   */
  function render(articles, category) {
    app.innerHTML +=
      "<section>" +
        "<header>" +
          "<h2 class='lh-title measure ttc'>" + category + "</h2>" +
        "</header>" +
        articles.slice(0, 3).map(buildArticle).join("") +
      "</section>";
  }

  /**
   * Fetch the articles for a category and insert them into the DOM
   * @param {String} category The category to use
   */
  function fetchArticles(category) {
    fetch(endpoint + category + ".json?api-key=" + apiKey)
      .then(getJSON)
      .then(function(data) {
        render(data.results, category);
      })
      .catch(insertError);
  }

  /**
   * Insert an error message into the DOM
   */
  function insertError() {
    app.innerHTML = "<p>Sorry, there was a problem getting today's stories!</p>";
    app.innerHTML += "<p>Please try again later.</p>";
  }



  /**
   * Init
   */

  // Remove the link to The New York Times
  app.innerHTML = "";

  // Insert the content from the API
  categories.forEach(fetchArticles);

})(document);
