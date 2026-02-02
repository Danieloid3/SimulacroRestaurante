// javascript
// `src/services/productService.js`
import JsonService from './JsonService.js';

class ProductService {
    constructor() {
        this.service = new JsonService();
        this.baseUrl = 'http://localhost:3000/products';
    }

    async getAll() {
        const res = await fetch(this.baseUrl);
        if (!res.ok) throw new Error('Error al obtener productos');
        return res.json();
    }

    async getById(id) {
        const res = await fetch(`${this.baseUrl}/${id}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        return res.json();
    }

    async create(product) {
        const res = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!res.ok) throw new Error('Error al crear producto');
        return res.json();
    }

    async update(id, product) {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!res.ok) throw new Error('Error al actualizar producto');
        return res.json();
    }

    async remove(id) {
        const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar producto');
        return true;
    }
}

export default ProductService;
