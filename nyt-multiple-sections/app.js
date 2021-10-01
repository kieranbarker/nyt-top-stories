'use strict';

const api = 'https://nyt.barker.workers.dev';

const sections = [ 'food', 'movies', 'technology' ];

const app = document.querySelector('#app');

function getJSON(response) {
  if (response.ok) return response.json();
  const error = new Error('Try again later.');
  return Promise.reject(error);
}

function fetchSection(section) {
  const options = { method: 'POST', body: section };
  return fetch(api, options).then(getJSON);
}

function getData() {
  const requests = sections.map(fetchSection);
  return Promise.allSettled(requests);
}

function getFulfilled(promises) {
  const fulfilled = promises.filter(result => result.status === 'fulfilled');
  return fulfilled.map(result => result.value);
}

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

function insertStories(data) {
  const fulfilled = getFulfilled(data);

  if (fulfilled.length < 1) {
    const rejected = data[0];
    return Promise.reject(rejected.reason);
  }

  app.innerHTML = fulfilled.map(getSectionHTML).join('');
}

function handleError(error) {
  app.textContent = error.toString();
}

getData()
  .then(insertStories)
  .catch(handleError);