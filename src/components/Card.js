// javascript
import JsonService from '../services/JsonService.js';

export async function Card(productId, isAdmin = false) {
    const service = new JsonService();
    const product_response = await service.getProductById(productId);

    const data = {
        id: product_response.id,
        category: product_response.category,
        imageUrl: product_response.img,
        title: product_response.name,
        price: product_response.price,
        description: product_response.description,
        stock: product_response.stock
    };

    const adminControls = isAdmin
        ? `
            <div class="admin-product-actions">
                <button class="button small tertiary edit-product-btn" data-id="${data.id}">
                    Edit
                </button>
                <button class="button small tertiary delete-product-btn" data-id="${data.id}">
                    Delete
                </button>
            </div>
        `
        : '';

    return `
        <article class="card product">
            <span class="badge">${data.category}</span>
            <img src="${data.imageUrl}" alt="${data.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${data.title}</h3>
                <p class="product-price">$ ${data.price}</p>
                <p class="product-description">${data.description}</p>

                <button class="button secondary add-to-cart-btn" data-id="${data.id}">
                    <svg class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                        <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                    Add to order
                </button>

                ${adminControls}
            </div>
        </article>
    `;
}
