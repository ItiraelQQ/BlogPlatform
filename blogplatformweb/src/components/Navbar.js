import React, { useState } from 'react';
import Login from './Login';  
import Register from './Register';  
import '../styles/Navbar.css';  

const Navbar = () => {
    const [activeModal, setActiveModal] = useState(null); 

    const openLoginModal = () => setActiveModal('login');
    const openRegisterModal = () => setActiveModal('register');
    const closeModal = () => setActiveModal(null); 

    // Закрываем модальное окно, если кликаем за его пределами
    const handleOutsideClick = (e, closeModal) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <nav className="navbar">
            <div className="container"> 
                <div className="brand">
                    <h1 className="brandText">Название сайта</h1>
                </div>
                <div className="links">
                    <button onClick={openLoginModal} className="link">Войти</button>
                    <button onClick={openRegisterModal} className="link">Регистрация</button>
                </div>
            </div>

            {/* Отображаем модальное окно */}
            {activeModal === 'login' && (
                <div
                    className="overlay"
                    onClick={(e) => handleOutsideClick(e, closeModal)} 
                >
                    <Login onClose={closeModal} />
                </div>
            )}
            {activeModal === 'register' && (
                <div
                    className="overlay"
                    onClick={(e) => handleOutsideClick(e, closeModal)} 
                >
                    <Register onClose={closeModal} />
                </div>
            )}
        </nav>
    );
};

export default Navbar;
