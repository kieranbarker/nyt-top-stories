;(function(d) {

  "use strict";

  /**
   * Variables
   */

  var endpoint = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=JraYD8iHz930GynlEnoalaAfNhBkCyUB";
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

  function getJSON(response) {
    return (response.ok) ? response.json() : Promise.reject(response);
  }

  function getStories(data) {
    return data.results;
  }

  function buildListItem(story) {
    return (
      "<article class='mb4 athelas'>" +
        "<header>" +
          "<h2 class='lh-title measure f4 f3-m f3-l'>" +
            "<a href='" + sanitizeHTML(story.url) + "'>" +
              sanitizeHTML(story.title) +
            "</a>" +
          "</h2>" +
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

  function insertHTML(stories) {
    app.innerHTML = stories.map(buildListItem).join("");
  }

  function insertError(error) {
    app.innerHTML = "<p>Sorry, there was a problem getting today's stories!</p>";
    app.innerHTML += "<p>Please try again later.</p>";
  }

  /**
   * Init
   */

  fetch(endpoint)
    .then(getJSON)
    .then(getStories)
    .then(insertHTML)
    .catch(insertError);

})(document);
