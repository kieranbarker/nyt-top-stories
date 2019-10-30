;(function(d) {

  /**
   * Variables
   */

  var endpoint = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=JraYD8iHz930GynlEnoalaAfNhBkCyUB";
  var app = d.querySelector("#app");

  /**
   * Functions
   */

  function getJSON(response) {
    return (response.ok) ? response.json() : Promise.reject(response);
  }

  function getStories(data) {
    return data.results;
  }

  function buildListItem(story) {
    return (
      "<li class='mb4 athelas'>" +
        "<article>" +
          "<h2 class='lh-title measure f4 f3-m f3-l'>" +
            "<a href='" + story.url + "'>" + story.title + "</a>" +
          "</h2>" +
          "<p class='lh-copy measure'>" + story.byline + "</p>" +
          "<p class='lh-copy measure'>" + story.abstract + "</p>" +
        "</article>" +
      "</li>"
    );
  }

  function insertHTML(stories) {
    app.innerHTML =
      "<ul class='list ph0'>" +
        stories.map(buildListItem).join("") +
      "</ul>";
  }

  function insertError(error) {
    app.innerHTML = "<p>Sorry, there was a problem getting today's stories!</p>";
    app.innerHTML += "<p>Please try again later.</p>"
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
