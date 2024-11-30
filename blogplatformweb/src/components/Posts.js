import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Импорт вашего API клиента
import '../styles/Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [themeName, setThemeName] = useState(''); // Состояние для имени темы

  const location = useLocation();
  const themeId = new URLSearchParams(location.search).get('themeId'); // Получаем themeId из URL

  // Функция для извлечения первой картинки из HTML контента
  const extractFirstImage = (content) => {
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;  // Возвращает URL первой картинки или null, если картинка не найдена
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get(`https://localhost:44357/api/posts?themeId=${themeId}`);
        
        // Сортируем посты по дате (свежие сверху)
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Обновляем посты с добавлением первой картинки
        const postsWithImages = sortedPosts.map((post) => {
          const firstImage = extractFirstImage(post.content); // Извлекаем первую картинку
          return { ...post, firstImage };
        });
        setPosts(postsWithImages); // Сохраняем отсортированные посты в состояние

        // Устанавливаем имя темы из первого поста (предполагается, что у постов есть тема)
        if (response.data.length > 0 && response.data[0].theme) {
          setThemeName(response.data[0].theme.name); // Получаем имя темы
        }
      } catch (err) {
        setError('Ошибка загрузки постов');
      }
    };

    if (themeId) {
      fetchPosts(); // Запрос для получения постов по теме
    }
  }, [themeId]);

  return (
    <div className="posts-container">
      <h1>{themeName}</h1>
      {error && <p className="error">{error}</p>}
      <div className="posts-list">
        {posts.length === 0 ? (
          <p>Посты по этой теме не найдены</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <Link to={`/post/${post.id}`} className="post-link">
                <h3 className="post-title">{post.title}</h3>
              </Link>
              {/* Если первая картинка найдена, отображаем её */}
              {post.firstImage && <img src={post.firstImage} alt={post.title} className="post-image" />}
              <p>Автор: {post.authorName}</p>
              <p>Опубликовано: {post.timeAgo}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
