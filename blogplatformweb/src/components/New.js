import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import '../styles/New.css';

const New = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get('https://localhost:44357/api/posts');
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Сортируем по дате (по убыванию)
        setPosts(sortedPosts);
      } catch (err) {
        setError('Ошибка загрузки постов');
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="new-container">
      <h1>Последние посты</h1>
      {error && <p className="error">{error}</p>}
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={`/post/${post.id}`} className="post-link">
              <h3 className="post-title">{post.title}</h3>
            </Link>
            <p className="post-time">{post.timeAgo}</p>
            <p className="post-author">Автор: {post.authorName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default New;
