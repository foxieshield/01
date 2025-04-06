// Escuchar cuando se hace clic en el botón
document.getElementById('fetchBtn').addEventListener('click', () => {
  const subreddit = document.getElementById('subredditInput').value.trim();
  if (subreddit) {
    fetchSubredditPosts(subreddit);
  }
});

// Función para obtener los posts de un subreddit
function fetchSubredditPosts(subreddit) {
  const url = `https://www.reddit.com/r/${subreddit}.json`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const posts = data.data.children;
      displayPosts(posts);
    })
    .catch(error => {
      console.error('Error al obtener datos:', error);
      document.getElementById('results').innerHTML = '<p>Error al cargar el subreddit.</p>';
    });
}

// Mostrar los títulos en la página
function displayPosts(posts) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

  posts.forEach(post => {
    const title = post.data.title;
    const element = document.createElement('p');
    element.textContent = title;
    resultsDiv.appendChild(element);
  });
}
