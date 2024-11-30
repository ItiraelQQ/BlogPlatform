import React, { useEffect, useState } from 'react';
import { FaFire, FaNewspaper, FaGamepad, FaCode, FaLaptop, FaPlaystation, FaPaintBrush, FaFilm, FaMusic, FaBook, FaPlane, FaTv } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Ваш API клиент
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Состояние для открытия/закрытия меню
  const [themes, setThemes] = useState([]); // Состояние для хранения списка тем

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Переключаем состояние меню
  };

  useEffect(() => {
    // Запрос к серверу для получения всех тем
    const fetchThemes = async () => {
      try {
        const response = await apiClient.get('https://localhost:44357/api/posts/themes'); // Замените URL на ваш реальный
        setThemes(response.data); // Сохраняем полученные темы в состоянии
      } catch (err) {
        console.error('Ошибка при загрузке тем:', err);
      }
    };

    fetchThemes(); // Запрос на загрузку тем
  }, []);

  // Функция для получения иконки для каждой темы
  const getThemeIcon = (themeName) => {
    switch (themeName) {
      case 'Игры': return <FaGamepad />;
      case 'Программирование': return <FaCode />;
      case 'Компьютеры': return <FaLaptop />;
      case 'Консоли': return <FaPlaystation />;
      case 'Искусство': return <FaPaintBrush />;
      case 'Кино и сериалы': return <FaFilm />;
      case 'Музыка': return <FaMusic />;
      case 'Гайды': return <FaBook />;
      case 'Путешествия': return <FaPlane />;
      case 'Аниме': return <FaTv />;
      default: return <FaNewspaper />;
    }
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
            <Link to="/home">
              <button className="sidebar-button">
                <FaFire style={{ marginRight: '10px' }} />
                Популярное
              </button>
            </Link>
          </li>
          <li>
            <Link to="/new">
              <button className="sidebar-button">
                <FaNewspaper style={{ marginRight: '10px' }} />
                Новое
              </button>
            </Link>
          </li>

          {/* Отображение списка тем */}
          <li>
            <h3>Темы</h3>
            <ul className="sidebar-themes">
              {themes.map((theme) => (
                <li key={theme.id} className="sidebar-theme-item">
                  <Link to={`/posts?themeId=${theme.id}`} className="sidebar-theme-link">
                    <span className="theme-icon">{getThemeIcon(theme.name)}</span> {/* Иконка темы */}
                    {theme.name} {/* Название темы */}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
