import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import apiClient from '../api/apiClient';
import '../styles/CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Для HTML-содержимого
  const username = useState('');
  const userId = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const postData = {
      title,
      content, // HTML из редактора
      createdAt: new Date().toISOString(),
      authorName: username,
      authorId: userId,
    };

    try {
      await apiClient.post('https://localhost:44357/api/posts', postData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Пост создан успешно!');
    } catch (err) {
      console.error('Ошибка при создании поста:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка при создании поста');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Создание нового поста</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="title">Заголовок</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Содержание</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            formats={[
              'header',
              'bold',
              'italic',
              'underline',
              'strike',
              'list',
              'bullet',
              'link',
              'image',
            ]}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Создание...' : 'Создать пост'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
