import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../api/apiClient'; 
import { FaEye } from 'react-icons/fa';
import '../styles/Posts.css'; 

const Posts = ({ type = 'all' }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [themeName, setThemeName] = useState('');

  // Получаем параметр themeId из URL
  const location = useLocation();
  const themeId = new URLSearchParams(location.search).get('themeId');

  // Функция для извлечения первой картинки из контента
  const extractFirstImage = (content) => {
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  };

  // Запрос на получение постов в зависимости от типа
  const fetchPosts = async () => {
    try {
      let url = 'https://localhost:44357/api/posts'; 

      // Меняем URL в зависимости от типа постов
      if (type === 'popular') {
        url += '/popular'; 
      } else if (type === 'new') {
        url += '/new'; 
      }

      // Если передан themeId, добавляем его к запросу
      if (themeId) {
        url += `?themeId=${themeId}`;
      }

      const response = await apiClient.get(url);

      // Сортируем посты по дате для новизны (если нужно) или по просмотрам для популярных
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Сортировка по дате (новые посты первыми)

      // Добавляем первую картинку к каждому посту
      const postsWithImages = sortedPosts.map((post) => {
        const firstImage = extractFirstImage(post.content);
        return {
          ...post,
          firstImage,
        };
      });

      setPosts(postsWithImages);

      // Устанавливаем название темы для отображения
      if (themeId && response.data.length > 0 && response.data[0].theme) {
        setThemeName(response.data[0].theme.name);
      }
    } catch (err) {
      setError('Ошибка загрузки постов');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [type, themeId]);

  return (
    <div className="new-container">
      <h1>{type === 'popular' ? 'Популярные посты' : type === 'new' ? 'Новые посты' : themeName || 'Все посты'}</h1>
      {error && <p className="error">{error}</p>}
      <div className="posts-list">
        {posts.length === 0 ? (
          <p>Посты не найдены</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="user-info">
                  {/* Загружаем аватарку с проверкой на существование */}
                  <img
                    src={`https://localhost:44357${post.authorAvatarUrl || '/uploads/avatars/default.jpg'}`}
                    alt={post.authorName || 'Без имени'}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <p className="user-name">{post.authorName || 'Неизвестный автор'}</p>
                    <p className="post-theme">{post.theme?.name || 'Без темы'}</p>
                  </div>
                </div>
                <p className="post-time">{post.timeAgo}</p>
              </div>

              {/* Заголовок и картинка поста */}
              <a href={`/post/${post.id}`} className="post-link">
                <h3 className="post-title">{post.title}</h3>
              </a>

              {/* Если первая картинка найдена, отображаем её */}
              {post.firstImage && <img src={post.firstImage} alt={post.title} className="post-image" />}
              
              <p>
                <FaEye style={{ marginRight: '10px' }} />
                {post.views}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
