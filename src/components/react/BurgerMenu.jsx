/* src/components/BurgerMenu.jsx */

import React from "react";

function BurgerMenu({ isOpen, setIsOpen, menuItems }) {
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {/* Hamburger Icon */}
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
          <ul className="py-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.link.startsWith("#")) {
                      const targetElement = document.querySelector(item.link);
                      if (targetElement) {
                        targetElement.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.location.href = item.link;
                      }
                    } else {
                      window.location.href = item.link;
                    }
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BurgerMenu;
