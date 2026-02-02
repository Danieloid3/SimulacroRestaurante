import {register} from "../services/authService.js";

// Se importa en app.js
export function RegisterView() {
    const main = document.createElement('main');
    main.classList.add('container');

    const brand = document.createElement('div');
    brand.classList.add('brand');
    brand.innerHTML =
        `<div class="icon-circle">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 9H9V2H15V9H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 11V13H21V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 13L6 22H18L16 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <h1 class="title">RestorApp</h1>
        <p class="subtitle">Create your account</p>`;

    const form = document.createElement('form');
    form.classList.add('form', 'form-register');
    form.innerHTML =
        `<div class="field">
                <label for="name" class="label">Full Name</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input type="text" id="name" class="input" placeholder="e.g. John Doe">
                </div>
            </div>

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

            <div class="field">
                <label for="confirm-password" class="label">Confirm Password</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input type="password" id="confirm-password" class="input" placeholder="••••••••">
                </div>
            </div>

            <div class="field field-full">
                <label for="role" class="label">Select Role</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <select id="role" class="input select">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            
            <p id="register-error" class="form-error" style="display:none;color:red;"></p>

            <button type="submit" class="button primary button-full">Sign Up</button>

            <p class="footer-text">
                Already have an account? <a href="login.html" class="link">Sign in</a>
            </p>`;
    const registerCard = document.createElement('div')
    registerCard.classList.add('card', 'register-card');
    registerCard.appendChild(brand);
    registerCard.appendChild(form);

    main.appendChild(registerCard);

    registerRequest(main);

    return main;
}
function registerRequest(main) {
    const form = main.querySelector('.form-register');
    const errorParagraph = main.querySelector('#register-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value;
        const confirmPassword = form.querySelector('#confirm-password').value;
        const role = form.querySelector('#role').value;

        // Validaciones básicas
        if (!name || !email || !password || !confirmPassword) {
            errorParagraph.style.display = 'block';
            errorParagraph.textContent = 'Please fill in all fields.';
            return;
        }

        if (password !== confirmPassword) {
            errorParagraph.style.display = 'block';
            errorParagraph.textContent = 'Passwords do not match.';
            return;
        }

        try {
            const usuario = await register({ name, email, password, role });

            // Verificar respuesta del servicio
            if(usuario.success) {
                window.location.hash = '#login';
            } else {
                throw new Error(usuario.error || 'Error desconocido');
            }
        } catch (error) {
            errorParagraph.style.display = 'block';
            errorParagraph.textContent = error.message || 'Registration failed. Please try again.';
        }
    });
}