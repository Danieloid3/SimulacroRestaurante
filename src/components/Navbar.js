// javascript
/* src/components/Navbar.js */
import { logout } from '../services/authService.js';
import { getCurrentUser } from '../services/authService.js';

export function Navbar() {
    const header = document.createElement('header');
    header.classList.add('header');
    header.innerHTML = `
        <div class="header-content">
            <div class="logo">
                <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 9H9V2H15V9H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 11V13H21V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 13L6 22H18L16 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="logo-text">RestorApp</span>
            </div>
            <nav class="nav">
                <a href="#menu" class="nav-link active">Menu</a>
                <a href="#orders" class="nav-link">My Orders</a>
                <a href="#profile" class="nav-link">Profile</a>
            </nav>
        </div>
    `;

    const user = getCurrentUser();
    const nav = header.querySelector('.nav');

    // Crear botón de logout (no se inserta aún)
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.classList.add('nav-link');
    logoutBtn.style.marginLeft = '1rem';
    logoutBtn.style.color = 'var(--color-error)';
    logoutBtn.textContent = 'Log out';

    // Si es admin, primero agregamos el link Admin y luego el logout
    if (user && user.role === 'admin') {
        const adminLink = document.createElement('a');
        adminLink.href = '#dashboard';
        adminLink.classList.add('nav-link');
        adminLink.textContent = 'Admin';
        nav.appendChild(adminLink);
        nav.appendChild(logoutBtn);
    } else {
        // Si no es admin, el logout va al final de los demás items
        nav.appendChild(logoutBtn);
    }

    // Acción del botón de logout
    logoutBtn.addEventListener('click', () => {
        logout();
    });

    return header;
}
