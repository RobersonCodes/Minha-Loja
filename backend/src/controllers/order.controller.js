const OrderService = require("../services/order.service");

class OrderController {
    async create(req, res, next) {
        try {
            const order = await OrderService.createOrder(req.body);

            return res.status(201).json({
                success: true,
                message: "Pedido criado com sucesso.",
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const orders = await OrderService.getAllOrders();

            return res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const order = await OrderService.getOrderById(Number(req.params.id));

            return res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const order = await OrderService.updateOrderStatus(
                Number(req.params.id),
                req.body.status
            );

            return res.status(200).json({
                success: true,
                message: "Status do pedido atualizado com sucesso.",
                data: order
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();