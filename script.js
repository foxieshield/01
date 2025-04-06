// Escuchar cuando se hace clic en el botón
document.getElementById('fetchBtn').addEventListener('click', () => {
  const subreddit = document.getElementById('subredditInput').value.trim();

  // Si se escribe una URL de un post, buscar el video del post
  if (subreddit.startsWith('https://www.reddit.com/r/')) {
    fetchPostVideo(subreddit);
  } else if (subreddit) {
    // Si no es una URL, se asume que es un subreddit
    fetchSubredditPosts(subreddit);
  }
});

// Función para obtener los posts de un subreddit
function fetchPostVideo(postUrl) {
  const jsonUrl = postUrl.endsWith('/') ? postUrl + '.json' : postUrl + '/.json';

  fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
      const postData = data[0].data.children[0].data;
      const media = postData.secure_media || postData.media;
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // Limpiar

      if (media?.reddit_video?.fallback_url) {
        const videoUrl = media.reddit_video.fallback_url;

        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.controls = true;
        videoElement.width = 600;

        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.textContent = 'Descargar video';
        downloadLink.download = 'video.mp4';

        resultsDiv.appendChild(videoElement);
        resultsDiv.appendChild(document.createElement('br'));
        resultsDiv.appendChild(downloadLink);
      } else if (postData.url && postData.url.endsWith('.mp4')) {
        // Caso alternativo: el post tiene un link directo a un MP4
        const videoUrl = postData.url;

        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.controls = true;
        videoElement.width = 600;

        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.textContent = 'Descargar video';
        downloadLink.download = 'video.mp4';

        resultsDiv.appendChild(videoElement);
        resultsDiv.appendChild(document.createElement('br'));
        resultsDiv.appendChild(downloadLink);
      } else {
        resultsDiv.innerHTML = '<p>No se encontró un video compatible en este post.</p>';
      }
    })
    .catch(error => {
      console.error('Error al obtener el video:', error);
      document.getElementById('results').innerHTML = '<p>Error al cargar el video del post.</p>';
    });
}

}

// Mostrar los títulos de los posts en la página
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

// 🔽 NUEVA FUNCIÓN: Obtener video de un post específico
function fetchPostVideo(postUrl) {
  // Asegurarse de que la URL termine con '.json'
  const jsonUrl = postUrl.endsWith('/') ? postUrl + '.json' : postUrl + '/.json';

  fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
      const postData = data[0].data.children[0].data;
      const media = postData.secure_media;

      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

      if (media && media.reddit_video) {
        const videoUrl = media.reddit_video.fallback_url;

        // Crear el elemento de video
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.controls = true;
        videoElement.width = 600;

        const link = document.createElement('a');
        link.href = videoUrl;
        link.textContent = 'Descargar video';
        link.download = 'video.mp4';

        resultsDiv.appendChild(videoElement);
        resultsDiv.appendChild(document.createElement('br'));
        resultsDiv.appendChild(link);
      } else {
        resultsDiv.innerHTML = '<p>No se encontró video en este post.</p>';
      }
    })
    .catch(error => {
      console.error('Error al obtener el video:', error);
      document.getElementById('results').innerHTML = '<p>Error al cargar el video del post.</p>';
    });
}
