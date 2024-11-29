import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("https://localhost:44357/api/account/profile");
        setProfile(response.data);
      } catch (err) {
        setError("Ошибка загрузки профиля.");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h2>Профиль</h2>
      <p>Имя пользователя: {profile.username}</p>
    </div>
  );
};

export default Profile;
