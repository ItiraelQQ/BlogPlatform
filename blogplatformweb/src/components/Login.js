import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient'; 

const Login = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('https://localhost:44357/api/account/login', { username, password });
            
            if (response.data.token) {
                localStorage.setItem('jwtToken', response.data.token); 
                window.location.reload(); 
                onClose(); 
            } else {
                setError('Ошибка входа. Проверьте имя пользователя или пароль.');
            }
        } catch (err) {
            setError('Ошибка входа. Проверьте имя пользователя или пароль.');
        }
    };

    return (
        <div style={styles.modalContent}>
            <div style={styles.closeIcon} onClick={onClose}>×</div>
            <h2 style={styles.header}>Войти</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Войти</button>
            </form>
        </div>
    );
};

const styles = {
    modalContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center',
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#232324',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        color: 'white',
        position: 'relative',
    },
    header: {
        fontSize: '24px',
        color: 'white',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    form: {
        width: '100%',
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#598FDE',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    closeIcon: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '24px',
        color: '#fff',
        cursor: 'pointer',
    },
};

export default Login;
