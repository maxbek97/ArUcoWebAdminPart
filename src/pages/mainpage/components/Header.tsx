import React, { useState, useRef, useEffect } from 'react';
import NavButton from './NavButton';
import ActionButton from './ActionButton';
import '../Header.css';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDict, setSelectedDict] = useState("Тестовый словарь");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
        document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (dict: string) => {
    setSelectedDict(dict);
    setIsOpen(false);
  };


  const dictionaries = [
    "Словарь 1","Словарь 2","Словарь 3","Словарь 4",
    "Словарь 5","Словарь 6","Словарь 7","Словарь 8",
    "Словарь 9","Словарь 10","Словарь 11","Словарь 12",
    "Словарь 13","Словарь 14","Словарь 15","Словарь 16",
  ];
  

  const handleAction = () => {
      //Тут потом будет вызываь эндпоинт для рофла
  };

  return (
    <div>
      <header className="header-container">
        {/* ЛЕВАЯ ЧАСТЬ: Навигация */}
        <nav className="header-nav">
          <div className="logo-placeholder">V</div>
          <button
              ref={buttonRef}
              className="dict-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedDict}
            </button>
        </nav>

        {/* ПРАВАЯ ЧАСТЬ: Кнопка */}
        <div className="header-actions">
          <ActionButton text="Применить" onClick={handleAction} />
        </div>
      </header>
        <div 
          ref={dropdownRef}
          className={`dict-dropdown ${isOpen ? "open" : ""}`}
        >
          <div className='dict-grid'>
            {dictionaries.map((dict, index) => (
              <button
                key={index}
                className="dict-item"
                onClick={
                  () => handleSelect(dict)
                }
              >
                {dict}
              </button>
            ))}
          </div>
        </div>
    </div>
  );
};

export default Header;