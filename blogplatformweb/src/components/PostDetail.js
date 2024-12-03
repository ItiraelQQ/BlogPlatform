import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import apiClient from '../api/apiClient'; 
import Comments from './Comments';
import '../styles/PostDetail.css'; 

const PostDetail = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get(`https://localhost:44357/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Ошибка при загрузке поста');
      }
    };

    fetchPost();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!post) return <p>Загрузка...</p>;

  return (
    <div className="post-detail-container">
      <div className="post-card">
        {/* Заголовок и информация о пользователе */}
        <div className="post-header">
          <div className="user-info">
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
          <div className="post-meta">
            <p className="post-time">{post.timeAgo}</p>
          </div>
        </div>

        {/* Заголовок поста */}
        <h3 className="post-title">{post.title}</h3>

        {/* Контент поста */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        
      </div>

      {/* Комментарии */}
      <Comments postId={id} />
    </div>
  );
};

export default PostDetail;
