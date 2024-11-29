import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("https://localhost:44357/api/account/register", { username, password });
      navigate("/login");
    } catch (err) {
      setError("Ошибка регистрации.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Register;
