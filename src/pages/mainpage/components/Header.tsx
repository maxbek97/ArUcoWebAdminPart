import React from 'react';
import NavButton from './NavButton';
import ActionButton from './ActionButton';
import '../Header.css';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const menuItems = [
    { id: 1, href: '#describe_video', label: 'Описание' },
    { id: 2, href: '#tech', label: 'Технологии' },
  ];

  const navigate = useNavigate();

  const handleAction = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      // Если нет токена → редиректим на страницу авторизации
      navigate('/auth');
      return;
    };

    const link = document.createElement('a');
    link.href = '/result.txt';  // путь относительно public
    link.download = 'result.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="header-container">
      {/* ЛЕВАЯ ЧАСТЬ: Навигация */}
      <nav className="header-nav">
        <div className="logo-placeholder">V</div> {/* Вместо логотипа */}
        <ul className="nav-list">
          {menuItems.map((item) => (
            <NavButton key={item.id} href={item.href} label={item.label} />
          ))}
        </ul>
      </nav>

      {/* ПРАВАЯ ЧАСТЬ: Кнопка */}
      <div className="header-actions">
        <ActionButton text="Применить" onClick={handleAction} />
      </div>
    </header>
  );
};

export default Header;