const OrderRepository = require("../repositories/order.repository");

class OrderService {
    calculateFreight(subtotal) {
        return subtotal >= 500 ? 0 : 24.90;
    }

    validatePayload(payload) {
        const requiredFields = [
            "customer_name",
            "customer_email",
            "customer_phone",
            "customer_cpf",
            "zip_code",
            "street",
            "number",
            "neighborhood",
            "city",
            "state",
            "payment_method"
        ];

        for (const field of requiredFields) {
            if (!payload[field] || String(payload[field]).trim() === "") {
                throw new Error(`O campo ${field} é obrigatório.`);
            }
        }

        if (!Array.isArray(payload.items) || payload.items.length === 0) {
            throw new Error("O pedido deve conter pelo menos um item.");
        }
    }

    normalizeItems(items) {
        return items.map((item) => {
            const unitPrice = Number(item.price || 0);
            const quantity = Number(item.quantity || 0);

            return {
                product_id: Number(item.id),
                product_name: item.name,
                product_category: item.category || "",
                product_image: item.image || "",
                unit_price: unitPrice,
                quantity,
                line_total: unitPrice * quantity
            };
        });
    }

    validateStatus(status) {
        const allowedStatuses = [
            "pending",
            "paid",
            "shipped",
            "delivered",
            "canceled"
        ];

        if (!allowedStatuses.includes(status)) {
            throw new Error("Status de pedido inválido.");
        }
    }

    async createOrder(payload) {
        this.validatePayload(payload);

        const items = this.normalizeItems(payload.items);

        const itemsCount = items.reduce((total, item) => total + item.quantity, 0);
        const subtotal = items.reduce((total, item) => total + item.line_total, 0);
        const freight = this.calculateFreight(subtotal);
        const total = subtotal + freight;

        const createdOrder = await OrderRepository.createOrder({
            customer_name: payload.customer_name,
            customer_email: payload.customer_email,
            customer_phone: payload.customer_phone,
            customer_cpf: payload.customer_cpf,
            zip_code: payload.zip_code,
            street: payload.street,
            number: payload.number,
            neighborhood: payload.neighborhood,
            city: payload.city,
            state: payload.state,
            payment_method: payload.payment_method,
            items_count: itemsCount,
            subtotal,
            freight,
            total,
            status: "pending"
        });

        for (const item of items) {
            await OrderRepository.createOrderItem({
                order_id: createdOrder.id,
                ...item
            });
        }

        const savedItems = await OrderRepository.findItemsByOrderId(createdOrder.id);

        return {
            ...createdOrder,
            items: savedItems
        };
    }

    async getAllOrders() {
        const orders = await OrderRepository.findAllOrders();

        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const items = await OrderRepository.findItemsByOrderId(order.id);

                return {
                    ...order,
                    items
                };
            })
        );

        return ordersWithItems;
    }

    async getOrderById(orderId) {
        const order = await OrderRepository.findOrderById(orderId);

        if (!order) {
            throw new Error("Pedido não encontrado.");
        }

        const items = await OrderRepository.findItemsByOrderId(orderId);

        return {
            ...order,
            items
        };
    }

    async updateOrderStatus(orderId, status) {
        this.validateStatus(status);

        const existingOrder = await OrderRepository.findOrderById(orderId);

        if (!existingOrder) {
            throw new Error("Pedido não encontrado.");
        }

        const result = await OrderRepository.updateOrderStatus(orderId, status);

        if (!result.changes) {
            throw new Error("Não foi possível atualizar o status do pedido.");
        }

        return this.getOrderById(orderId);
    }
}

module.exports = new OrderService();