import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient'; 
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();  
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`https://localhost:44357/api/account/profile/${userId}`);
        setUserProfile(response.data);

        const postsResponse = await apiClient.get(`https://localhost:44357/api/posts/user-posts/${userId}`);
        setUserPosts(postsResponse.data);
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
      {error && <p className="error">{error}</p>}
  
      {userProfile && (
        <div>
          <div className="user-profile-header">
            <div className="user-avatar-link">
              <img
                src={`https://localhost:44357${userProfile.avatarUrl}`}
                alt={userProfile.username}
                className="user-profile-avatar"
              />
            </div>
            <h1>{userProfile.username}</h1>
          </div>
  
          <div className="user-posts-container">
            <h3 >Посты пользователя:</h3>
            <div className="user-posts">
              {userPosts.length === 0 ? (
                <p>У этого пользователя нет постов.</p>
              ) : (
                userPosts.map(post => (
                  <div key={post.id} className="post-card">
                    <a href={`/post/${post.id}`} className="post-link">
                    <h4 class="post-title">{post.title}</h4>
                    <p class="post-content">{post.content}</p>
                    <p class="post-content"><small>{post.timeAgo}</small></p>
                    <p class="post-content"><small>{post.views}</small></p>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  
};

export default UserProfile;
