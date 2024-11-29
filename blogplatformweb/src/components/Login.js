import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post("https://localhost:44357/api/account/login", {username, password});
            localStorage.setItem("token", response.data.token);
            navigate("/profile");
        } catch (err){
            setError("Ошибка входа. Проверьте имя пользователя или пароль.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
          <h2>Вход</h2>
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
          <button type="submit">Войти</button>
        </form>
      ); 
};

export default Login;