// Конфигурация API
const API_BASE_URL = 'http://localhost:3000/api';

// Функция для получения всех статей блога
async function loadBlogPosts() {
  try {
    showLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/posts`);
    const data = await response.json();
    
    if (data.success && data.data) {
      displayBlogPosts(data.data);
      showError(false);
    } else {
      showError(true, 'Не удалось загрузить статьи');
    }
  } catch (error) {
    console.error('Ошибка загрузки статей:', error);
    showError(true, 'Ошибка подключения к серверу');
  } finally {
    showLoading(false);
  }
}

// Функция для получения конкретной статьи
async function loadBlogPost(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error('Статья не найдена');
    }
  } catch (error) {
    console.error('Ошибка загрузки статьи:', error);
    return null;
  }
}

// Функция для отображения списка статей
function displayBlogPosts(posts) {
  const container = document.getElementById('blog-posts');
  
  if (!container) {
    console.error('Контейнер #blog-posts не найден');
    return;
  }

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="no-posts">
        <p>Статьи скоро появятся!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = posts.map(post => `
    <article class="blog-post-card">
      <div class="post-header">
        <h3 class="post-title">
          <a href="#" onclick="openPost(${post.id}); return false;">${post.title}</a>
        </h3>
        <div class="post-meta">
          <span class="author">Автор: ${post.author}</span>
          <span class="date">${formatDate(post.created_at)}</span>
        </div>
      </div>
      
      <div class="post-content">
        <p class="post-excerpt">${post.excerpt || 'Краткое описание недоступно'}</p>
        <button class="read-more-btn" onclick="openPost(${post.id})">
          Читать далее →
        </button>
      </div>
    </article>
  `).join('');
}

// Функция для открытия отдельной статьи
async function openPost(postId) {
  const post = await loadBlogPost(postId);
  
  if (!post) {
    alert('Статья не найдена');
    return;
  }

  // Создаем модальное окно для статьи
  const modal = document.createElement('div');
  modal.className = 'post-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${post.title}</h2>
        <button class="close-btn" onclick="closePostModal()">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="post-meta">
          <span>Автор: ${post.author}</span>
          <span>Дата: ${formatDate(post.created_at)}</span>
        </div>
        
        <div class="post-full-content">
          ${formatContent(post.content)}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closePostModal() {
  const modal = document.querySelector('.post-modal');
  if (modal) {
    modal.remove();
  }
}

// Вспомогательные функции
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatContent(content) {
  return content.replace(/\n/g, '</p><p>').replace(/^(.+)$/, '<p>$1</p>');
}

function showLoading(show) {
  const loader = document.getElementById('blog-loader');
  if (loader) {
    loader.style.display = show ? 'block' : 'none';
  }
}

function showError(show, message = '') {
  const errorElement = document.getElementById('blog-error');
  if (errorElement) {
    errorElement.style.display = show ? 'block' : 'none';
    if (message) {
      errorElement.textContent = message;
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, есть ли на странице блок для блога
  if (document.getElementById('blog-posts')) {
    loadBlogPosts();
  }
});

// Функция для обновления списка статей
function refreshBlog() {
  loadBlogPosts();
}