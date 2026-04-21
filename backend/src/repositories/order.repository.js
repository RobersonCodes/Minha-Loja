const db = require("../config/database");

class OrderRepository {
    createOrder(orderData) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO orders (
                    customer_name,
                    customer_email,
                    customer_phone,
                    customer_cpf,
                    zip_code,
                    street,
                    number,
                    neighborhood,
                    city,
                    state,
                    payment_method,
                    items_count,
                    subtotal,
                    freight,
                    total,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                orderData.customer_name,
                orderData.customer_email,
                orderData.customer_phone,
                orderData.customer_cpf,
                orderData.zip_code,
                orderData.street,
                orderData.number,
                orderData.neighborhood,
                orderData.city,
                orderData.state,
                orderData.payment_method,
                orderData.items_count,
                orderData.subtotal,
                orderData.freight,
                orderData.total,
                orderData.status || "pending"
            ];

            db.run(query, params, function (error) {
                if (error) {
                    return reject(error);
                }

                resolve({
                    id: this.lastID,
                    ...orderData
                });
            });
        });
    }

    createOrderItem(itemData) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO order_items (
                    order_id,
                    product_id,
                    product_name,
                    product_category,
                    product_image,
                    unit_price,
                    quantity,
                    line_total
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                itemData.order_id,
                itemData.product_id,
                itemData.product_name,
                itemData.product_category,
                itemData.product_image,
                itemData.unit_price,
                itemData.quantity,
                itemData.line_total
            ];

            db.run(query, params, function (error) {
                if (error) {
                    return reject(error);
                }

                resolve({
                    id: this.lastID,
                    ...itemData
                });
            });
        });
    }

    findAllOrders() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM orders
                ORDER BY id DESC
            `;

            db.all(query, [], (error, rows) => {
                if (error) {
                    return reject(error);
                }

                resolve(rows);
            });
        });
    }

    findOrderById(orderId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM orders
                WHERE id = ?
            `;

            db.get(query, [orderId], (error, row) => {
                if (error) {
                    return reject(error);
                }

                resolve(row || null);
            });
        });
    }

    findItemsByOrderId(orderId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM order_items
                WHERE order_id = ?
                ORDER BY id ASC
            `;

            db.all(query, [orderId], (error, rows) => {
                if (error) {
                    return reject(error);
                }

                resolve(rows);
            });
        });
    }

    updateOrderStatus(orderId, status) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE orders
                SET status = ?
                WHERE id = ?
            `;

            db.run(query, [status, orderId], function (error) {
                if (error) {
                    return reject(error);
                }

                resolve({
                    changes: this.changes
                });
            });
        });
    }
}

module.exports = new OrderRepository();