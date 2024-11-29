import React from 'react';

const Home = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Добро пожаловать на наш сайт!</h1>
            <p style={styles.subtitle}>Это главная страница, где скоро появится больше контента.</p>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '100px 20px',
        backgroundColor: '#f4f4f4',
        minHeight: '100vh',
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subtitle: {
        fontSize: '18px',
        color: '#7f8c8d',
        marginTop: '10px',
    },
};

export default Home;
