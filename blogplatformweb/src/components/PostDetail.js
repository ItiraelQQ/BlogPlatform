import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import apiClient from '../api/apiClient'; 
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
      <h1>{post.title}</h1>
      {/* Здесь выводим контент с изображениями */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <p><strong>Дата создания:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
      <p><strong>Время создания:</strong> {post.timeAgo}</p>
      <p><strong>Тема:</strong> {post.theme.name}</p>
    </div>
  );
};

export default PostDetail;
