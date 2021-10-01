'use strict';

const api = 'https://nyt.barker.workers.dev';

const app = document.querySelector('#app');

function getJSON(response) {
  if (response.ok) return response.json();
  const error = new Error('Try again later.');
  return Promise.reject(error);
}

function getData() {
  return fetch(api).then(getJSON);
}

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

function insertStories({ results }) {
  app.innerHTML = results.map(getStoryHTML).join('');
}

function handleError(error) {
  app.textContent = error.toString();
}

function init() {
  getData()
    .then(insertStories)
    .catch(handleError);
}

init();