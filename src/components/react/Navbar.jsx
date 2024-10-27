import { useState } from "react";
import { Suspense, lazy } from "react";
import pkg from 'react-use';
const { useLocation } = pkg;

// Use lazy loading instead of react-loadable
const BurgerMenu = lazy(() => import("./BurgerMenu"));


function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle link clicks for smooth scrolling
  const handleLinkClick = (e, target) => {
    if (target.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false); // Close menu on link click
      } else {
        window.location.href = target;
      }
    } else {
      setIsMenuOpen(false); // Close menu on link click
    }
  };

  const menuItems = [
    { id: 1, link: "/#services", label: "I nostri servizi" },
    { id: 2, link: "/gallery", label: "Gallery" },
    { id: 3, link: "/contacts", label: "Contatti" },
    { id: 4, link: "/#booking-section", label: "Prenota" },
  ];

  return (
    <div className="fixed top-0 z-40 flex w-full items-center justify-between bg-white px-4 py-4 text-sm transition duration-300 ease-in-out md:px-28 lg:px-64">
      <a href="/">
        <img src="/images/logo.png" className="w-16 lg:w-20" alt="Logo" />
      </a>
      <ul className="hidden gap-10 md:flex">
        <li>
          <a
            href="/#services"
            onClick={(e) => handleLinkClick(e, "/#services")}
            className="link cursor-pointer focus:font-bold focus:text-primary active:decoration-primary"
          >
            I NOSTRI SERVIZI
          </a>
        </li>
        <li>
          <a
            href="/gallery"
            onClick={(e) => handleLinkClick(e, "/gallery")}
            className="link cursor-pointer focus:font-bold focus:text-primary active:decoration-primary"
          >
            GALLERY
          </a>
        </li>
        <li>
          <a
            href="/contacts"
            onClick={(e) => handleLinkClick(e, "/contacts")}
            className="link cursor-pointer focus:font-bold focus:text-primary active:decoration-[#cfcccc]"
          >
            CONTATTI
          </a>
        </li>
        <li>
          <a
            href="/#booking-section"
            onClick={(e) => handleLinkClick(e, "/#booking-section")}
            className="link cursor-pointer focus:text-primary active:decoration-primary focus:font-bold"
          >
            PRENOTA
          </a>
        </li>
      </ul>
      <div className="md:hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <BurgerMenu
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
            menuItems={menuItems}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default Navbar;
