import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient'; 
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();  
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`https://localhost:44357/api/account/profile/${userId}`);
        setUserProfile(response.data);
      } catch (err) {
        setError('Ошибка загрузки профиля пользователя');
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!userProfile) return <p>Загрузка...</p>;

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <img
          src={`https://localhost:44357${userProfile.avatarUrl || '/uploads/avatars/default.jpg'}`}
          alt={userProfile.username || 'Без имени'}
          className="user-profile-avatar"
        />
        <h1>{userProfile.username}</h1>
      </div>
      <div className="user-bio">
        
      </div>
      {/* Добавьте другие части профиля, например, посты пользователя */}
    </div>
  );
};

export default UserProfile;
