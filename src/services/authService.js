import {API_URLS} from "../utils/constants.js";

export async function login(email, password) {
    try {

        const response = await fetch(`${API_URLS.USERS}?email=${(email)}`);

        if (!response.ok) {
            throw new Error('Error de conexión con el servidor');
        }

        const users = await response.json();
        const user = users[0];

        if (!user) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        if (user.password !== password) {
            return { success: false, error: 'Contraseña incorrecta' };
        }

        // Guardamos el usuario activo en localStorage para persistencia básica
        // Nota: NO guardar contraseñas en localStorage en producción real
        const sessionUser = { ...user };
        delete sessionUser.password; // Quitamos la contraseña del objeto en memoria
        localStorage.setItem('activeUser', JSON.stringify(sessionUser));

        return { success: true, user: sessionUser };

    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Ocurrió un error inesperado' };
    }
}
export async function register(userData) {
    try {
        // 1. Verificar si el email ya existe
        const checkRef = await fetch(`${API_URLS.USERS}?email=${(userData.email)}`);
        const existingUsers = await checkRef.json();

        if (existingUsers.length > 0) {
            return { success: false, error: 'El correo electrónico ya está registrado' };
        }

        // 2. Crear el usuario
        const response = await fetch(`${API_URLS.USERS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('No se pudo crear el usuario');
        }

        const newUser = await response.json();
        return { success: true, user: newUser };

    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: error.message || 'Error al registrar usuario' };
    }
}

/**
 * Cierra la sesión del usuario actual.
 */
export function logout() {
    localStorage.removeItem('activeUser');
    window.location.hash = '#login';
}

/**
 * Obtiene el usuario autenticado actualmente desde localStorage.
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('activeUser');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
}

/**
 * Verifica si hay un usuario autenticado.

 */
export function isAuthenticated() {
    return !!getCurrentUser();
}

// javascript
// authService.js

export function isAdmin() {
    const user = getCurrentUser();
    return !!user && user.role === 'admin';
}

/**
 * Redirige a login si no hay usuario autenticado.
 */
export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.hash = '#login';
        throw new Error('Usuario no autenticado');
    }
}

/**
 * Redirige a menu si el usuario no es admin.
 */
export function requireAdmin() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.hash = '#menu';
        throw new Error('Acceso no autorizado. Sólo admin.');
    }
}

