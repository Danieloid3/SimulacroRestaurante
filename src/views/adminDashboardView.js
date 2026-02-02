// javascript
// `src/views/adminDashboardView.js`
import { getCurrentUser } from '../services/authService.js';
import { API_URLS } from '../utils/constants.js';
import { LoadingView } from '../components/Loading.js';

export async function AdminDashboardView() {
    const user = getCurrentUser();

    // Protección extra en la propia vista (además del router)
    if (!user || user.role !== 'admin') {
        window.location.hash = '#menu';
        const main = document.createElement('main');
        main.classList.add('container');
        main.innerHTML = '<p>Acceso no autorizado.</p>';
        return main;
    }

    const main = document.createElement('main');
    main.classList.add('layout', 'dashboard-layout');

    const content = document.createElement('section');
    content.classList.add('content');

    const header = document.createElement('div');
    header.classList.add('section-header');
    header.innerHTML = `
        <h1 class="page-title">Admin Dashboard</h1>
        <span class="profile-role">Admin panel</span>
    `;

    const metricsWrapper = document.createElement('div');
    metricsWrapper.classList.add('metrics');
    metricsWrapper.innerHTML = LoadingView();

    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');
    tableContainer.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th class="id">ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th class="price">Total</th>
                </tr>
            </thead>
            <tbody id="admin-orders-body">
                <tr>
                    <td colspan="5" style="text-align:center;padding:1.5rem;">
                        Cargando pedidos...
                    </td>
                </tr>
            </tbody>
        </table>
    `;

    content.appendChild(header);
    content.appendChild(metricsWrapper);
    content.appendChild(tableContainer);

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');
    sidebar.innerHTML = `
        <div class="profile-card">
            <div class="avatar">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name || 'Admin'
    )}&background=00D26B&color=fff&size=120" alt="${user.name}">
                <div class="avatar-badge">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
            <h2 class="profile-name">${user.name}</h2>
            <p class="profile-email">${user.email}</p>
            <span class="profile-role">Admin</span>
        </div>

        <nav class="menu-list">
            <a href="#menu" class="menu-item">
                <span>Volver al menú</span>
            </a>
            <a href="#orders" class="menu-item">
                <span>Ver pedidos de usuario</span>
            </a>
        </nav>

        <footer class="page-footer">
            RestorApp Admin Console<br>
            Academic Simulation
        </footer>
    `;

    main.appendChild(content);
    main.appendChild(sidebar);

    // Cargar datos asíncronos
    loadDashboardData(metricsWrapper, tableContainer.querySelector('#admin-orders-body'));

    return main;
}

async function loadDashboardData(metricsContainer, ordersTbody) {
    try {
        const [productsRes, ordersRes] = await Promise.all([
            fetch(API_URLS.PRODUCTS),
            fetch(API_URLS.ORDERS)
        ]);

        if (!productsRes.ok || !ordersRes.ok) {
            throw new Error('Error al cargar datos del servidor');
        }

        const products = await productsRes.json();
        const orders = await ordersRes.json();

        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

        metricsContainer.innerHTML = `
            <div class="metric-card">
                <div class="metric-icon primary">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M3 3H21V21H3V3Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2"
                              stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="metric-info">
                    <p class="metric-label">Productos activos</p>
                    <p class="metric-value">${totalProducts}</p>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon warning">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 4H20V20H4V4Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 9H16" stroke="currentColor" stroke-width="2"
                              stroke-linecap="round"/>
                        <path d="M8 13H13" stroke="currentColor" stroke-width="2"
                              stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="metric-info">
                    <p class="metric-label">Pedidos totales</p>
                    <p class="metric-value">${totalOrders}</p>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon success">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 1V23" stroke="currentColor" stroke-width="2"
                              stroke-linecap="round"/>
                        <path d="M5 8C6.5 6 8.5 5 12 5C15.5 5 17.5 6 19 8" stroke="currentColor"
                              stroke-width="2" stroke-linecap="round"/>
                        <path d="M5 16C6.5 18 8.5 19 12 19C15.5 19 17.5 18 19 16" stroke="currentColor"
                              stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="metric-info">
                    <p class="metric-label">Ingresos totales</p>
                    <p class="metric-value">$ ${totalRevenue.toFixed(2)}</p>
                </div>
            </div>
        `;

        // Ordenar por fecha (si existe createdAt)
        const sortedOrders = [...orders].sort((a, b) => {
            const da = new Date(a.createdAt || 0).getTime();
            const db = new Date(b.createdAt || 0).getTime();
            return db - da;
        });

        const rowsHtml = sortedOrders
            .slice(0, 10)
            .map(o => {
                const customerName = o.user?.name || 'Invitado';
                const date = o.createdAt
                    ? new Date(o.createdAt).toLocaleString()
                    : '-';
                const status = o.status || 'pending';
                const total = (o.total || 0).toFixed(2);

                return `
                    <tr>
                        <td class="id">#${o.id}</td>
                        <td>${customerName}</td>
                        <td>${date}</td>
                        <td>
                            <span class="status-badge ${status}">
                                ${status}
                            </span>
                        </td>
                        <td class="price">$ ${total}</td>
                    </tr>
                `;
            })
            .join('');

        ordersTbody.innerHTML = rowsHtml || `
            <tr>
                <td colspan="5" style="text-align:center;padding:1.5rem;">
                    No hay pedidos registrados.
                </td>
            </tr>`;
    } catch (error) {
        console.error('Admin dashboard error:', error);
        metricsContainer.innerHTML = `
            <p class="error">No se pudieron cargar las métricas.</p>
        `;
        ordersTbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:1.5rem;color:red;">
                    Error cargando pedidos.
                </td>
            </tr>`;
    }
}
