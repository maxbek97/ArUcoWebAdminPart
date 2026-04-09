import React from 'react';

interface NavLinkProps {
  href: string;
  label: string;
}

const NavButton: React.FC<NavLinkProps> = ({ href, label }) => {
  return (
    <li className="nav-item">
      <a href={href} className="nav-link">
        {label}
      </a>
    </li>
  );
};

export default NavButton;