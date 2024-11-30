import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import apiClient from '../api/apiClient';
import '../styles/CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [themes, setThemes] = useState([]); 
  const [selectedThemeId, setSelectedThemeId] = useState(''); 
  const [user, setUser] = useState(null); 
  const selectedTheme = themes.find(t => t.id === selectedThemeId);

  // Загрузка списка тем и информации о пользователе
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await apiClient.get('https://localhost:44357/api/posts/themes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
        setThemes(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке тем:', err.response?.data || err.message);
        setError('Не удалось загрузить список тем');
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get('https://localhost:44357/api/account/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
  
        // Сохраняем данные профиля в стейт
        setUser({
          username: response.data.username,
          userId: response.data.userId,
          avatarUrl: response.data.avatarUrl,
        });
  
        console.log('User profile:', response.data); 
  
      } catch (err) {
        console.error('Ошибка при получении профиля:', err.response?.data || err.message);
        setError('Не удалось получить данные профиля');
      }
    };
    fetchThemes();
    fetchUserProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      setError('Пользователь не найден');
      setIsSubmitting(false);
      return;
    }

    // Заполнение данных для поста
    const postData = {
      title,
      content,
      createdAt: new Date().toISOString(),
      authorName: user.username,  
      authorId: user.userId,      
      authorAvatarUrl: user.avatarUrl, 
      theme: {
        id: selectedThemeId,  
        name: selectedTheme ? selectedTheme.name : ""  
      },
    };
    
    console.log('Post data:', postData);  
    
    try {
      await apiClient.post('https://localhost:44357/api/posts/create-post', postData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Пост создан успешно!');
    } catch (err) {
      console.error('Ошибка при создании поста:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка при создании поста');
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
          <label htmlFor="theme">Тема</label>
          <select
            id="theme"
            value={selectedThemeId}
            onChange={(e) => setSelectedThemeId(e.target.value)}
            required
          >
            <option value="">Выберите тему</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
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
