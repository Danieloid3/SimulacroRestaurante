import {login} from '../services/authService.js';

export function LoginView() {
    const main = document.createElement('main');
    main.classList.add('container');
    main.innerHTML = `
     <div class="card">
        <div class="brand">
            <div class="icon-circle">
                <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 9H9V2H15V9H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 11V13H21V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 13L6 22H18L16 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h1 class="title">RestorApp</h1>
            <p class="subtitle">Login to your account</p>
        </div>

        <form class="form" id ="loginForm">
            <div class="field">
                <label for="email" class="label">Email Address</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input type="email" id="email" class="input" placeholder="name@example.com">
                </div>
            </div>

            <div class="field">
                <label for="password" class="label">Password</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input type="password" id="password" class="input" placeholder="••••••••">
                </div>
            </div>

            <button type="submit" class="button primary">
            <a href="#menu"></a>Sign In</button>
            <p class="auth-error hidden" id="auth-error">
              Credenciales inválidas. Intenta nuevamente.
            </p>
            
            <p class="auth-success hidden" id="auth-success">
              ¡Inicio de sesión exitoso!
            </p>

            <p class="footer-text">
                Don't have an account? <a href="#register" class="link">Sign up</a>
            </p>
        </form>
    </div>

    <footer class="page-footer">
        RestorApp Academic Simulation
    </footer>
`;
    setTimeout(() => {
        attachEventListeners();
    }, 0);

    return main;
}

function attachEventListeners() {

    const form = document.getElementById('loginForm');

    if (form) {
        console.log('[LOGIN] Formulario encontrado');
        form.addEventListener('submit', handleLogin);
    }
}
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    console.log('[LOGIN] Datos de login:', {email});
    // Validaciones
    if (!email || !password) {
        console.warn('[LOGIN] Validación fallida: Campos vacíos');
        showError('Por favor completa todos los campos');
        return;
    }
    console.log('[LOGIN] Enviando credenciales al servidor...');

    const result = await login(email, password);

    if (result.success) {
        console.log('[LOGIN] Login exitoso:', result.user);
        showSuccess('¡Inicio de sesión exitoso! Redirigiendo...');

        console.log('[LOGIN] Esperando 1 segundos antes de redirigir...');
        setTimeout(() => {
            console.log('[LOGIN] Redirigiendo a menu...');
            window.location.hash = '#menu';
            console.log('[LOGIN] Hash cambiado a #menu');
        }, 1000);
    } else {
        console.error('[LOGIN] Login fallido:', result.error);
        showError(result.error);
    }
}
function showError(message) {
    console.error('[UI] Mostrando error:', message);

    const errorElement = document.getElementById('auth-error');
    const successElement = document.getElementById('auth-success');

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    if (successElement) {
        successElement.classList.add('hidden');
    }

    setTimeout(() => {
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }, 5000);
}

function showSuccess(message) {
    console.log('[UI] Mostrando éxito:', message);

    const errorElement = document.getElementById('auth-error');
    const successElement = document.getElementById('auth-success');

    if (successElement) {
        successElement.textContent = message;
        successElement.classList.remove('hidden');
    }

    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}