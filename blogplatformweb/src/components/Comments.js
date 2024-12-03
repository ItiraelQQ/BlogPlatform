import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import '../styles/Comments.css'

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) {
      setError('Некорректный идентификатор поста');
      return;
    }
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`https://localhost:44357/api/comments/${postId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      setComments(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке комментариев:', err.response?.data || err.message);
      setError('Не удалось загрузить комментарии');
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    if (!content.trim()) {
      setError('Комментарий не может быть пустым');
      setIsSubmitting(false);
      return;
    }
  
    try {
      await apiClient.post(`https://localhost:44357/api/comments/${postId}`, content, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      });
  
      fetchComments();
      setContent(''); 
      alert('Комментарий добавлен успешно!');
    } catch (err) {
      console.error('Ошибка при добавлении комментария:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка при добавлении комментария');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="comments-section">
      <h2>Комментарии</h2>
      {error && <p className="error">{error}</p>}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>Комментариев пока нет</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <div className="comment-user">
                  <p className="user-name">{comment.userName}</p>
                  <p className="comment-time">{comment.timeAgo}</p>
                </div>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Оставьте комментарий"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
};

export default Comments;
