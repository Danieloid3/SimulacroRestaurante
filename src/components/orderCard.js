// javascript
import JsonService from '../services/JsonService.js';

export async function OrderCard(orderId) {
    const service = new JsonService();
    const order = await service.getOrderById(orderId);

    const data = {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        total: order.total,
        userName: order.user?.name || 'Guest',
        userEmail: order.user?.email || '',
        items: order.items || []
    };

    // Puedes ajustar las clases a las que ya tienes en styles.css (list-item, order-info, etc.)
    return `
        <article class="list-item">
            <div class="status-icon ${data.status}">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12
                             C22 6.47715 17.5228 2 12 2
                             C6.47715 2 2 6.47715 2 12
                             C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12L11 15L16 9"
                          stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>

            <div class="order-info">
                <h3 class="order-id">Order \#${data.id}</h3>
                <p class="order-meta">
                    ${new Date(data.createdAt).toLocaleString()} ·
                    ${data.items.length} item(s)
                </p>
                <div class="detail-items">
                    ${data.items
        .map(
            item => `
                        <div class="detail-item">
                            <span class="item-quantity">${item.quantity}x</span>
                            <div>
                                <div class="item-title">${item.name}</div>
                                <div class="item-note">$ ${item.price.toFixed(2)}</div>
                            </div>
                        </div>`
        )
        .join('')}
                </div>
            </div>

            <div class="order-actions">
                <span class="order-total">$ ${data.total.toFixed(2)}</span>
                <span class="status-badge ${data.status}">
                    ${data.status}
                </span>
            </div>
        </article>
    `;

}
