const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  if (!query) return next();

  return Product.find( {$text: {$search: query}} )
      .then((data) => {
        ctx.body = {products: (data || []).map(mapProduct)};
      })
      .catch((_) => ctx.throw(500, 'Unexpected error occured'));
};
