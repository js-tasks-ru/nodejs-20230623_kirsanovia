const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(
    ctx,
    next,
) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  return Product.find({subcategory})
      .then((data) => {
        ctx.body = {products: (data || []).map(mapProduct)};
      })
      .catch((_) => ctx.throw(500, 'Unexpected error occured'));
};

module.exports.productList = async function productList(ctx, next) {
  return Product.find()
      .then((data) => {
        ctx.body = {products: (data || []).map(mapProduct)};
      })
      .catch((_) => ctx.throw(500, 'Unexpected error occured'));
};

module.exports.productById = async function productById(ctx, next) {
  return Product.findById(ctx.params.id)
      .then((data) => {
        if (!data) ctx.throw(404, 'A product with passed id was not found');
        ctx.body = {product: mapProduct(data)};
      })
      .catch((e) => {
        if (e.statusCode === 404) ctx.throw(e);
        ctx.throw(500, 'Unexpected error occured');
      });
};
