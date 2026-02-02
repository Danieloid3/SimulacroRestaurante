// javascript
import { LoadingView } from '../components/Loading.js';
import JsonService from '../services/JsonService.js';
import { OrderCard } from '../components/orderCard.js';
import { getCurrentUser } from '../services/authService.js';

export async function orderView() {
    const user = getCurrentUser();

    const main = document.createElement('main');
    main.classList.add('layout', 'profile-layout');

    const contentColumn = document.createElement('section');
    contentColumn.classList.add('content');

    const header = document.createElement('div');
    header.classList.add('section-header');
    header.innerHTML = `
        <h1 class="page-title">Recent Orders</h1>
        <a href="#orders" class="link">View All</a>
    `;

    const orderList = document.createElement('div');
    orderList.classList.add('list');
    orderList.innerHTML = LoadingView();

    contentColumn.appendChild(header);
    contentColumn.appendChild(orderList);


    const sidebarColumn = document.createElement('aside');
    sidebarColumn.classList.add('sidebar');
    sidebarColumn.innerHTML = ` <div class="profile-card">
                <div class="avatar">
                    <img src="https://ui-avatars.com/api/?name=Alex+Student&background=00D26B&color=fff&size=120" alt="Alex Student">
                    <div class="avatar-badge">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                <h2 class="profile-name">${user.name}</h2>
                <p class="profile-email">${user.email}</p>
                <span class="profile-role">${user.role}</span>

                <div class="stats">
                    <div class="stat">
                        <p class="stat-label">TOTAL ORDERS</p>
                        <p class="stat-value">12</p>
                    </div>
                    <div class="stat">
                        <p class="stat-label">LOYALTY PTS</p>
                        <p class="stat-value accent">450</p>
                    </div>
                </div>
            </div>

            <nav class="menu-list">
                <a href="#" class="menu-item">
                    <svg class="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Payment Methods</span>
                    <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
                <a href="#" class="menu-item">
                    <svg class="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Saved Addresses</span>
                    <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
                <a href="#" class="menu-item">
                    <svg class="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Preferences</span>
                    <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </nav>

            <footer class="page-footer">
                RestorApp Academic Simulation V1.0<br>
                Performance monitoring active.
            </footer>`
    main.appendChild(contentColumn);
    main.appendChild(sidebarColumn);
    // Carga de órdenes manteniendo la idea de "cargar y luego renderizar"
    try {
        const service = new JsonService();
        const currentUser = getCurrentUser();
        const response = await fetch('http://localhost:3000/orders');
        if (!response.ok) throw new Error('Error HTTP ' + response.status);

        let orders = await response.json();

        if (currentUser) {
            orders = orders.filter(o => o.userId === currentUser.id);
        }

        // Generar HTML de tarjetas de orden usando OrderCard (similar a Card)
        const cardsHtml = await Promise.all(
            orders.map(order => OrderCard(order.id))
        );

        orderList.innerHTML = cardsHtml.join('');

    } catch (error) {
        console.error('Orders error:', error);
        orderList.innerHTML = `<p class="error">Could not connect to Orders API.</p>`;
    }

    return main;
}
