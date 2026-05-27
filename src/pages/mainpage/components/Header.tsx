import React, { useState, useRef, useEffect } from 'react';
import NavButton from './NavButton';
import ActionButton from './ActionButton';
import '../Header.css';
import AddMarkerModal from './modals/AddMarkerModal';
import { ADMIN_API } from "../../../apiConfig";

type HeaderProps = {
  selectedDict: string;
  setSelectedDict: (dict: string) => void;
  setFilterEnabled: (value: boolean) => void;
};

const Header: React.FC<HeaderProps> = ({selectedDict, setSelectedDict, setFilterEnabled}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDict, setCurrentDict] = useState("");
  const [dictionaries, setDictionaries] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken);
        const response = await fetch(`${ADMIN_API}/dictionaries`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
      });
        const data = await response.json();

        setDictionaries(data.dict_names || []);
		    setCurrentDict(data.current_dict || "");
        setSelectedDict(data.current_dict || "");
      } catch (error) {
        console.error("Ошибка загрузки словарей:", error);
      }
    };

    fetchDictionaries();
  }, []);

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
    setFilterEnabled(true);
  };



	const handleAction = async () => {
	try {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${ADMIN_API}/switch-dictionary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ dict_name: selectedDict }),
    });

		if (!response.ok) {
		throw new Error("Ошибка переключения словаря");
		}

		window.location.reload();

	} catch (error) {
		console.error("Ошибка переключения словаря:", error);
	}
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
            <span className="dict-text">
                {selectedDict}
              </span>
            <span
              className={`dict-dot-button ${
              selectedDict === currentDict ? "active" : ""
              }`}
            />
		      </button>
          <button
              className="dict-button"
              onClick={() => setIsModalOpen(true)}
            >
            <span className="dict-text">Новая метка</span>
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
            {dictionaries.map((dict, index) => {
              	const isActive = currentDict.trim() === dict.trim();

            	return (
              		<button
						key={index}
						className={`dict-item ${isActive ? "active" : ""}`}
						onClick={
							() => handleSelect(dict)
						}
					>
						<span className="dict-label">{dict}</span>
						{isActive && <span className="dict-dot" />}
              </button>
				);
			})}
          </div>
        </div>

        {isModalOpen && (
          <AddMarkerModal
            dictionaries={dictionaries}
            onClose={() => setIsModalOpen(false)}
          />
        )}
    </div>
  );
};

export default Header;