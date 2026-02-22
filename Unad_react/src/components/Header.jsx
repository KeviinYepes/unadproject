import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const goToProfile = () => {
    setIsProfileMenuOpen(false);
    navigate('/profile'); // Asegúrate que esta ruta exista en tu enrutador
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between whitespace-nowrap border-b border-border-light bg-card-light px-8 dark:border-border-dark dark:bg-card-dark">
      <div className="flex items-center gap-8">
        <label className="relative flex min-w-40 max-w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-xl text-text-light-secondary dark:text-dark-secondary">
              search
            </span>
          </div>
          <input
            className="form-input h-10 w-full flex-1 rounded-lg border-none bg-background-light pl-10 text-sm placeholder:text-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-background-dark dark:placeholder:text-dark-secondary"
            placeholder="Search tutorials..."
            type="search"
          />
        </label>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-background-light text-text-light-secondary transition-colors hover:bg-primary/10 hover:text-primary dark:bg-background-dark dark:text-dark-secondary dark:hover:bg-primary/20 dark:hover:text-primary">
          <span className="material-symbols-outlined text-2xl">notifications</span>
        </button>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-background-light text-text-light-secondary transition-colors hover:bg-primary/10 hover:text-primary dark:bg-background-dark dark:text-dark-secondary dark:hover:bg-primary/20 dark:hover:text-primary">
          <span className="material-symbols-outlined text-2xl">chat_bubble</span>
        </button>

        {/* Contenedor de la foto con menú */}
        <div className="relative" ref={menuRef}>
          <div
            className="h-10 w-10 cursor-pointer rounded-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNI4hMAUIyv4ffDBZGdjOGyb81zdNnseaqZB5GVQpk0KPDJi7CnsjZ-2IfG70EXL7XLdbhG2LekwQm1mToQNg6JAwRPs4DuVGvPgdyShBStgENRHHBXZo7Q1MaKBOe4TYmZzZMJC4P0TvK-0RtylqA-QHX_egtfcGwlDQkF2oPtQZa2s67E0HquLC1hazAqrUV7Kd9w8SRWSMLXlV4W7UUdQf9j_ph9RmRw6A4uG5sbvoGWHRrTsnaHuj9SFEmk2yOCbaEuFeUUTIQ')",
            }}
            onClick={toggleProfileMenu}
          />

          {/* Menú desplegable */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
              <button
                onClick={goToProfile}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Ver perfil
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}