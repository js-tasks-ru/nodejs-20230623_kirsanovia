const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');
const mapOrderConfirmation = require('../mappers/orderConfirmation');

module.exports.checkout = async function checkout(ctx, next) {
  try {
    const order = await Order.create({
      user: ctx.user.id,
      product: ctx.request.body.product,
      phone: ctx.request.body.phone,
      address: ctx.request.body.address,
    });

    const product = await order.populate('product');

    await sendMail({
      template: 'order-confirmation',
      locals: mapOrderConfirmation(order, product),
      to: ctx.user.email,
    });

    ctx.status = 200;
    ctx.body = {order: order.id};
  } catch (e) {
    ctx.throw(400, e);
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  try {
    const orders = await Order.find({user: ctx.user.id}).limit(20);

    ctx.status = 200;
    ctx.body = {orders: orders.map(mapOrder)};
  } catch (e) {
    ctx.throw(400, e);
  }
};
