import React, { useState } from 'react';
import { FaFire, FaNewspaper } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Состояние для открытия/закрытия меню

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Переключаем состояние меню
  };

  return (
    <div>
      {/* Кнопка бургер-меню */}
      <button className="burger-menu" onClick={toggleSidebar}>
        &#9776; {/* Символ для бургер-меню */}
      </button>

      {/* Боковое меню */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2 className="sidebar-title">Меню</h2>
        <ul className="sidebar-links">
          <li>
            <button className="sidebar-button">
              <FaFire style={{marginRight: '10px'}} />
              Популярное</button>
          </li>
          <li>
            <button className="sidebar-button">
              <FaNewspaper style={{marginRight: '10px'}} />
              Новое</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
