import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import Login from "./Login";
import Register from "./Register";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();
  
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
    checkLoginStatus();

  }, []);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch("https://localhost:44357/api/account/check-login-status", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setProfile(userData);
      } else {
        localStorage.removeItem("jwtToken");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Ошибка при проверке статуса логина", error);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    // Очистка токена из localStorage и sessionStorage
    localStorage.removeItem("jwtToken");
    sessionStorage.removeItem("jwtToken");

    // Обновление состояния аутентификации
    setIsAuthenticated(false);
    setProfile(null);

    // Перенаправление на страницу логина
    navigate("/home");
  };

  const closeModal = () => setActiveModal(null);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Название сайта</h1>
        </div>
        <div className="navbar-links">
          {isAuthenticated && profile ? (
            <div className="user-menu">
              <Link to="/profile">
                <img
                  src={`https://localhost:44357${profile.avatarUrl || "/uploads/avatars/default.jpg"}`}
                  alt="Аватар пользователя"
                  className="user-avatar"
                />
              </Link>
              <button onClick={handleLogout} className="logout-button">
                Выйти
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setActiveModal("login")} className="nav-link">
                Войти
              </button>
              <button onClick={() => setActiveModal("register")} className="nav-link">
                Регистрация
              </button>
            </>
          )}
        </div>
      </div>

      {activeModal === "login" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Login onClose={closeModal} />
        </div>
      )}

      {activeModal === "register" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <Register onClose={closeModal} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
