import { Navbar } from "./components/Navbar.js";
import { router } from "./router/router.js";

const app = document.getElementById('app');

export function render(viewNode) {
    app.innerHTML = '';

    // 1. Identificar la ruta actual (si está vacía, asumimos que es #login)
    const currentPath = window.location.hash || '#login';

    // 2. Definir en qué rutas NO queremos ver el Navbar
    const noNavbarRoutes = ['#login', '#register'];

    // 3. Solo agregar Navbar si la ruta actual NO está en la lista de excluidas
    if (!noNavbarRoutes.includes(currentPath)) {
        app.appendChild(Navbar());
    }

    // 4. Agregar el contenido de la vista
    app.appendChild(viewNode);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
