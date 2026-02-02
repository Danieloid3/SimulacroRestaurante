// javascript
import { Card } from '../components/Card.js';
import { LoadingView } from "../components/Loading.js";
import JsonService from "../services/jsonService.js";
import { getCurrentUser } from "../services/authService.js";

// Vista principal del menú
export async function menuView() {
    // ==== CONTENEDOR PRINCIPAL ====
    const main = document.createElement('main');
    main.classList.add('layout');

    // ==== COLUMNA DE CONTENIDO (PRODUCTOS) ====
    const contentColumn = document.createElement('section');
    contentColumn.classList.add('content');

    // Usuario actual y si es admin
    const currentUser = getCurrentUser();
    const isAdmin = currentUser && currentUser.role === 'admin';

    // Cabecera con título y botón de "Add product" sólo si es admin
    contentColumn.innerHTML = `
        <div class="section-header">
            <h1 class="page-title">Our Menu</h1>
            ${isAdmin
        ? `<button class="button primary" id="openProductModalBtn">+ Add product</button>`
        : ''}
        </div>
    `;

    // ==== BUSCADOR ====
    const searchSection = document.createElement('div');
    searchSection.classList.add('search-wrapper');
    searchSection.innerHTML = `
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input type="search" class="search" placeholder="Search food..." id="searchInput">
    `;

    // ==== FILTROS POR CATEGORÍA ====
    const filterGroup = document.createElement('div');
    filterGroup.classList.add('filter-group');
    filterGroup.id = 'filterContainer';
    filterGroup.innerHTML = `
        <button class="filter-button active" data-category="All">All</button>
        <button class="filter-button" data-category="Burgers">Burgers</button>
        <button class="filter-button" data-category="Sides">Sides</button>
        <button class="filter-button" data-category="Drinks">Drinks</button>
    `;

    // ==== GRID DE PRODUCTOS ====
    const productGrid = document.createElement('div');
    productGrid.classList.add('grid');
    // Mientras carga productos mostramos "loading"
    productGrid.innerHTML = LoadingView();

    // Añadimos secciones a la columna de contenido
    contentColumn.appendChild(searchSection);
    contentColumn.appendChild(filterGroup);
    contentColumn.appendChild(productGrid);

    // ==== SIDEBAR (CARRITO) ====
    const sidebarColumn = document.createElement('aside');
    sidebarColumn.classList.add('sidebar');
    sidebarColumn.innerHTML = `
        <div class="sidebar-header">
            <h2 class="sidebar-title">Your Order</h2>
            <span class="order-count" id="cartCount">0</span>
            <button class="link-button" id="clearCartBtn">Clear all</button>
        </div>
        <div class="order-items" id="cartItemsContainer">
            <p style="text-align:center; color: var(--color-text-secondary);">Your cart is empty</p>
        </div>
        <div class="order-summary">
            <div class="summary-row total">
                <span class="summary-label">Total</span>
                <span class="summary-value" id="cartTotal">$0.00</span>
            </div>
        </div>
        <button class="button primary" id="confirmOrderBtn" style="width:100%; margin-top:1rem;">
            Confirm Order
        </button>
        <p id="orderMessage" style="text-align:center; margin-top:10px; font-size: 0.9rem;"></p>
    `;

    // Añadimos columnas al layout principal
    main.appendChild(contentColumn);
    main.appendChild(sidebarColumn);

    // Servicio que llama a la API (productos, pedidos, etc.)
    const jsonService = new JsonService();

    // ==== ESTADO EN MEMORIA ====
    let cart = loadCartFromStorage();  // Carrito en memoria
    let allProducts = [];              // Lista completa de productos de la API
    let editingProduct = null;         // Producto que se está editando (null si estamos creando)

    // ==============================
    // Funciones de carrito
    // ==============================

    // Carga el carrito desde localStorage (o un array vacío si no hay nada / error)
    function loadCartFromStorage() {
        try {
            const stored = localStorage.getItem('shoppingCart');
            return stored ? JSON.parse(stored) : [];
        } catch {
            // Si localStorage está corrupto o falla, empezamos con carrito vacío
            return [];
        }
    }

    // Guarda el carrito actual en localStorage
    function saveCartToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Calcula nº total de items y precio total del carrito
    function calculateCartTotals() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
        return { totalItems, totalPrice };
    }

    // Devuelve el HTML de un item del carrito
    function buildCartItemHTML(item) {
        const product = item.product;
        return `
            <div class="order-item">
                <img src="${product.img || 'https://via.placeholder.com/80'}"
                     alt="${product.name}"
                     class="item-image">
                <div class="item-details">
                    <h4 class="item-name">${product.name}</h4>
                    <p class="item-price">$${product.price}</p>
                    <div class="quantity-control">
                        <button class="quantity-button decrease" data-id="${product.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-button increase" data-id="${product.id}">+</button>
                        <button class="remove-button remove" data-id="${product.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Actualiza toda la parte visual del sidebar (contador, total y lista)
    function updateSidebarUI() {
        const container = sidebarColumn.querySelector('#cartItemsContainer');
        const countBadge = sidebarColumn.querySelector('#cartCount');
        const totalLabel = sidebarColumn.querySelector('#cartTotal');

        // Siempre que cambiamos el carrito, lo persistimos
        saveCartToStorage();

        const { totalItems, totalPrice } = calculateCartTotals();
        countBadge.textContent = totalItems;
        totalLabel.textContent = `$${totalPrice.toFixed(2)}`;

        // Si el carrito está vacío, mostramos mensaje "Your cart is empty"
        if (cart.length === 0) {
            container.innerHTML = `
                <p style="text-align:center; color: var(--color-text-secondary);">
                    Your cart is empty
                </p>`;
            return;
        }

        // Si hay items, los pintamos todos
        container.innerHTML = cart.map(buildCartItemHTML).join('');
    }

    // Añade un producto al carrito (si ya existe, aumenta cantidad)
    function addToCart(productId) {
        const product = allProducts.find(p => p.id == productId);
        if (!product) return;  // Si no encontramos el producto, no hacemos nada

        const existingItem = cart.find(item => item.product.id == productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ product, quantity: 1 });
        }

        updateSidebarUI();
    }

    // ==============================
    // Confirmar pedido
    // ==============================

    async function handleConfirmOrder() {
        const messageEl = sidebarColumn.querySelector('#orderMessage');
        const btn = sidebarColumn.querySelector('#confirmOrderBtn');
        const user = getCurrentUser();

        // No se puede hacer pedido con carrito vacío
        if (cart.length === 0) {
            messageEl.textContent = 'Add items to cart first.';
            messageEl.style.color = 'var(--color-warning)';
            return;
        }

        // Si no hay usuario logueado, redirigimos a login
        if (!user) {
            alert('You must be logged in to order.');
            window.location.hash = '#login';
            return;
        }

        // Estructura del pedido que se enviará a la API
        const orderData = {
            userId: user.id,
            user: { name: user.name, email: user.email },
            items: cart.map(item => ({
                productId: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            })),
            total: cart.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            ),
            status: 'pending'
        };

        const originalText = btn.textContent;
        btn.textContent = 'Processing...';
        btn.disabled = true;

        try {
            await jsonService.createOrder(orderData);
            // Si el pedido se crea bien, vaciamos carrito y actualizamos UI
            cart = [];
            updateSidebarUI();
            messageEl.textContent = 'Order placed successfully!';
            messageEl.style.color = 'var(--color-success)';
            setTimeout(() => {
                messageEl.textContent = '';
            }, 3000);
        } catch (error) {
            console.error('Order error:', error);
            messageEl.textContent = 'Error placing order.';
            messageEl.style.color = 'var(--color-error)';
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    // ==============================
    // Pintar productos en el grid
    // ==============================

    // categoryFilter: "All" o nombre de categoría
    // searchTerm: texto a buscar en el nombre del producto
    async function renderProducts(categoryFilter = 'All', searchTerm = '') {
        // Mientras hacemos filtro/petición, mostramos pantalla de carga
        productGrid.innerHTML = LoadingView();

        try {
            // Filtramos en memoria según categoría y texto de búsqueda
            const filteredProducts = allProducts.filter(product => {
                const matchesCategory =
                    categoryFilter === 'All' || product.category === categoryFilter;

                const matchesSearch = product.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                return matchesCategory && matchesSearch;
            });

            // Si no hay resultados, mensaje vacío
            if (filteredProducts.length === 0) {
                productGrid.innerHTML = `<p class="subtitle">No items found.</p>`;
                return;
            }

            // Para cada producto generamos su tarjeta (Card devuelve HTML)
            const cardPromises = filteredProducts.map(product =>
                Card(product.id, isAdmin)
            );
            const cardsHtml = await Promise.all(cardPromises);
            productGrid.innerHTML = cardsHtml.join('');
        } catch (error) {
            console.error('Error displaying products', error);
            productGrid.innerHTML = `<p class="error">Error loading menu.</p>`;
        }
    }

    // ==============================
    // Modal de producto (crear/editar) — sólo admin
    // ==============================

    // Abre el modal. Si recibe un producto, es modo edición; si no, modo creación.
    function openProductModal(product = null) {
        editingProduct = product;

        const backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop');
        backdrop.id = 'productModalBackdrop';

        const title = product ? 'Edit product' : 'Add product';

        // Valores iniciales del formulario: si es edición, rellenamos con datos del producto
        const values = {
            name: product?.name || '',
            price: product?.price || '',
            description: product?.description || '',
            img: product?.img || '',
            category: product?.category || 'Burgers',
            stock: product?.stock ?? 0
        };

        backdrop.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <button class="modal-close" id="closeProductModalBtn">&times;</button>
                </div>
                <form id="productForm" class="form">
                    <div class="field">
                        <label class="label" for="productName">Name</label>
                        <div class="input-wrapper">
                            <input class="input" type="text" id="productName" value="${values.name}">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="productPrice">Price</label>
                        <div class="input-wrapper">
                            <input class="input" type="number" step="0.01" id="productPrice" value="${values.price}">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="productCategory">Category</label>
                        <div class="input-wrapper">
                            <select class="input select" id="productCategory">
                                <option value="Burgers" ${values.category === 'Burgers' ? 'selected' : ''}>Burgers</option>
                                <option value="Sides" ${values.category === 'Sides' ? 'selected' : ''}>Sides</option>
                                <option value="Drinks" ${values.category === 'Drinks' ? 'selected' : ''}>Drinks</option>
                            </select>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="productStock">Stock</label>
                        <div class="input-wrapper">
                            <input class="input" type="number" id="productStock" value="${values.stock}">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="productImg">Image URL</label>
                        <div class="input-wrapper">
                            <input class="input" type="text" id="productImg" value="${values.img}">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="productDescription">Description</label>
                        <div class="input-wrapper">
                            <textarea class="input" id="productDescription" rows="3">${values.description}</textarea>
                        </div>
                    </div>
                    <p id="productFormError" class="auth-error hidden"></p>
                    <div class="modal-actions">
                        <button type="button" class="button tertiary" id="cancelProductModalBtn">Cancel</button>
                        <button type="submit" class="button primary" id="saveProductBtn">
                            ${product ? 'Save changes' : 'Create product'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(backdrop);
        attachProductModalEvents();
    }

    // Cierra el modal y limpia el estado de edición
    function closeProductModal() {
        const backdrop = document.getElementById('productModalBackdrop');
        if (backdrop) backdrop.remove();
        editingProduct = null;
    }

    // Asigna todos los listeners del modal (cerrar, cancelar, submit)
    function attachProductModalEvents() {
        const backdrop = document.getElementById('productModalBackdrop');
        if (!backdrop) return;

        const closeBtn = backdrop.querySelector('#closeProductModalBtn');
        const cancelBtn = backdrop.querySelector('#cancelProductModalBtn');
        const form = backdrop.querySelector('#productForm');
        const errorEl = backdrop.querySelector('#productFormError');

        const handleClose = () => closeProductModal();

        closeBtn.addEventListener('click', handleClose);
        cancelBtn.addEventListener('click', handleClose);

        // Cerrar haciendo click fuera del modal
        backdrop.addEventListener('click', e => {
            if (e.target === backdrop) {
                closeProductModal();
            }
        });

        // Envío del formulario de producto (crear/editar)
        form.addEventListener('submit', async e => {
            e.preventDefault();
            errorEl.classList.add('hidden');
            errorEl.textContent = '';

            // Leemos valores del formulario
            const name = form.querySelector('#productName').value.trim();
            const price = parseFloat(form.querySelector('#productPrice').value);
            const category = form.querySelector('#productCategory').value;
            const stock = parseInt(form.querySelector('#productStock').value || '0', 10);
            const img = form.querySelector('#productImg').value.trim();
            const description = form.querySelector('#productDescription').value.trim();

            // Validación mínima
            if (!name || isNaN(price)) {
                errorEl.textContent = 'Name and price are required.';
                errorEl.classList.remove('hidden');
                return;
            }

            const payload = {
                name,
                price,
                category,
                stock,
                img,
                description
            };

            try {
                if (editingProduct) {
                    // Modo edición: actualizamos el producto en API y en memoria
                    const updated = await jsonService.updateProduct(editingProduct.id, {
                        ...editingProduct,
                        ...payload
                    });

                    const index = allProducts.findIndex(p => p.id === editingProduct.id);
                    if (index !== -1) {
                        allProducts[index] = updated;
                    }
                } else {
                    // Modo creación: creamos en API y lo añadimos a la lista local
                    const created = await jsonService.createProduct(payload);
                    allProducts.push(created);
                }

                // Volvemos a renderizar productos con el filtro y búsqueda actuales
                const activeCategory =
                    filterGroup.querySelector('.filter-button.active').dataset.category;
                const currentSearch = searchSection.querySelector('#searchInput').value;

                await renderProducts(activeCategory, currentSearch);
                closeProductModal();
            } catch (err) {
                console.error(err);
                errorEl.textContent = 'Error saving product.';
                errorEl.classList.remove('hidden');
            }
        });
    }

    // ==============================
    // Eventos de UI
    // ==============================

    // Evento click en el grid de productos (delegación):
    // - añadir al carrito
    // - editar producto (admin)
    // - eliminar producto (admin)
    productGrid.addEventListener('click', async e => {
        // Añadir al carrito
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            const id = addBtn.dataset.id;
            addToCart(id);
            return;
        }

        // Si no es admin, no permitimos editar/eliminar
        if (!isAdmin) return;

        // Editar producto
        const editBtn = e.target.closest('.edit-product-btn');
        if (editBtn) {
            const id = editBtn.dataset.id;
            const product = allProducts.find(p => String(p.id) === String(id));
            if (product) openProductModal(product);
            return;
        }

        // Eliminar producto
        const deleteBtn = e.target.closest('.delete-product-btn');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            const confirmDelete = window.confirm('Delete this product?');
            if (!confirmDelete) return;

            try {
                await jsonService.deleteProduct(id);
                // Quitamos el producto eliminado de la lista local
                allProducts = allProducts.filter(p => String(p.id) !== String(id));

                const activeCategory =
                    filterGroup.querySelector('.filter-button.active').dataset.category;
                const currentSearch = searchSection.querySelector('#searchInput').value;

                await renderProducts(activeCategory, currentSearch);
            } catch (err) {
                console.error(err);
                alert('Error deleting product');
            }
        }
    });

    // Evento click en el sidebar:
    // - cambiar cantidades (+ / -)
    // - eliminar item
    // - limpiar carrito
    // - confirmar pedido
    sidebarColumn.addEventListener('click', e => {
        const target = e.target;
        const id = target.getAttribute('data-id');

        // Click sin data-id: botones generales del sidebar
        if (!id) {
            if (target.id === 'clearCartBtn') {
                cart = [];
                updateSidebarUI();
            } else if (target.id === 'confirmOrderBtn') {
                handleConfirmOrder();
            }
            return;
        }

        // Click con data-id: botones de un item del carrito
        const itemIndex = cart.findIndex(item => item.product.id == id);
        if (itemIndex === -1) return;

        if (target.classList.contains('increase')) {
            cart[itemIndex].quantity++;
        } else if (target.classList.contains('decrease')) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            } else {
                // Si baja de 1, eliminamos el item
                cart.splice(itemIndex, 1);
            }
        } else if (target.classList.contains('remove')) {
            cart.splice(itemIndex, 1);
        }

        updateSidebarUI();
    });

    // ==== Filtros de categoría ====
    const filterButtons = filterGroup.querySelectorAll('.filter-button');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', e => {
            // Marcamos sólo el botón pulsado como activo
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const category = e.currentTarget.getAttribute('data-category');
            const searchTerm = searchSection.querySelector('#searchInput').value;
            renderProducts(category, searchTerm);
        });
    });

    // ==== Búsqueda por texto ====
    const searchInput = searchSection.querySelector('#searchInput');
    searchInput.addEventListener('input', e => {
        const activeCategory = filterGroup
            .querySelector('.filter-button.active')
            .getAttribute('data-category');
        renderProducts(activeCategory, e.target.value);
    });

    // ==== Botón "Add product" (sólo admin) ====
    if (isAdmin) {
        const openModalBtn = contentColumn.querySelector('#openProductModalBtn');
        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => openProductModal(null));
        }
    }

    // ==============================
    // Carga inicial de productos
    // ==============================

    try {
        // Obtenemos productos de la API y los guardamos en memoria
        allProducts = await jsonService.getProducts();
        // Pintamos todos los productos sin filtros
        await renderProducts();
        // Pintamos carrito (por si había algo en localStorage)
        updateSidebarUI();
    } catch (error) {
        console.error('Products error:', error);
        productGrid.innerHTML = `<p class="error">Could not connect to API.</p>`;
    }

    return main;
}
