const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  return Category.find()
      .then((data) => {
        ctx.body = {categories: (data || []).map(mapCategory)};
      })
      .catch((_) => ctx.throw(500, 'Unexpected error occured'));
};
