import React from 'react';
import '../Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
      


        <p className="footer-copyright">
          © {currentYear} Venaja и любые связанные логотипы являются просто по преколу по рофлу, ну потому что стиль мне нравится, но если выстрелит не воруйте пжпжпж
        </p>
      </div>
    </footer>
  );
};

export default Footer;