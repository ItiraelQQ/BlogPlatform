import React, { useState } from 'react';
import apiClient from '../api/apiClient'; // Adjust based on your api setup

const Register = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('https://localhost:44357/api/account/register', { username, password, email });
            onClose(); // Close the modal after successful registration
        } catch (err) {
            setError('Ошибка регистрации. Попробуйте снова.');
        }
    };

    return (
        <div style={styles.modalContent}>
            <div style={styles.closeIcon} onClick={onClose}>×</div>
            <h2 style={styles.header}>Регистрация</h2>
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
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Зарегистрироваться</button>
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
        maxWidth: '400px',  // Ensures modal does not grow too large
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative', // Allows positioning of the close icon
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',  // Adds spacing below the header
    },
    error: {
        color: 'red',
        marginBottom: '10px',  // Adds space between error and form inputs
    },
    form: {
        width: '100%',  // Ensure the form spans the full width
        marginBottom: '15px',  // Adds space below the form
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
        backgroundColor: '#333',
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
        color: '#000',
        cursor: 'pointer',
    },
};

export default Register;
