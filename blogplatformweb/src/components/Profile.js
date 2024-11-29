import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "../styles/Profile.css"; // Подключаем стили

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Состояние загрузки

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken"); // Получаем токен из localStorage
      if (!token) {
        setError("Токен отсутствует. Пожалуйста, войдите снова.");
        return;
      }

      try {
        const response = await apiClient.get("https://localhost:44357/api/account/profile", {
          headers: {
            "Authorization": `Bearer ${token}` // Добавляем токен в заголовок
          }
        });
        setProfile(response.data);
      } catch (err) {
        setError("Ошибка загрузки профиля.");
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true); // Начало загрузки
      const formData = new FormData();
      formData.append("file", file); // Название поля должно совпадать с серверным

      try {
        const response = await apiClient.post("https://localhost:44357/api/account/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProfile({ ...profile, avatarUrl: response.data.avatarUrl }); // Обновляем URL аватарки
      } catch (err) {
        setError("Ошибка загрузки аватарки.");
      } finally {
        setIsUploading(false); // Завершение загрузки
      }
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Профиль</h2>
      <div className="profile-info">
        {profile.avatarUrl ? (
          <label className="avatar-label">
            <img
              src={`https://localhost:44357${profile.avatarUrl}`}
              alt="Аватар пользователя"
              className="profile-avatar"
            />
            {isUploading && <p className="uploading-text">Загрузка...</p>}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="file-input"
            />
          </label>
        ) : (
          <p className="no-avatar">Аватар не загружен</p>
        )}
        <p>Имя пользователя: {profile.username}</p>
      </div>
    </div>
  );
};

export default Profile;
