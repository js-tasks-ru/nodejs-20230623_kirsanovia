const Koa = require('koa');
const Router = require('koa-router');

const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');
const validateObjectId = require('./libs/validateObjectId');
const Product = require('./models/Product');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

Product.create({
  title: 'Product1',
  description: 'Description1',
  price: 10,
  category: '64bea7fcb2422b342be9819b',
  subcategory: '64bea7fcb2422b342be9819c',
  images: ['image1'],
});

const router = new Router({prefix: '/api'});
const validateProductId = (ctx, next) => validateObjectId(ctx.params.id, ctx, next);

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', validateProductId, productById);

app.use(router.routes());

module.exports = app;
