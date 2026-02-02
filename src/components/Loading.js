export function LoadingView() {
    return `
        <div class="container">
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-title">Cargando datos climáticos...</p>
                <p class="loading-subtitle">Conectando con la API Open-Meteo</p>
            </div>
        </div>`;
}