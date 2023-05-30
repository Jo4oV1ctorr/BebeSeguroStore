
// toda configuração da tela PlaceOrder de finalização de pedido

//Objeto ''Order'' representa um novo pedido que esta sendo criado dentro do servidor e processando

// aqui eu faço uma requisição e uma resposta vinda do servidor atraves dessas orders

//ele define a rota POST para criar um novo pedido quando o cliente envia a requisição pra essa rota
// o servidor entende e armazena o novo pedido

import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils';
import Order from '../models/orderModel';

const orderRouter = express.Router();
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: req.body.payment,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).send({ message: 'Novo Pedido Criado', order: createdOrder });
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.payment.paymentResult = {
        payerID: req.body.payerID,
        paymentID: req.body.paymentID,
        orderID: req.body.orderID,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found.' });
    }
  })
);


export default orderRouter;