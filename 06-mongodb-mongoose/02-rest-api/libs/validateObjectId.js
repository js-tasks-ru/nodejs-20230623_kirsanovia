const mongoose = require('mongoose');

module.exports = function validateObjectId(id, ctx, next) {
  if (!mongoose.isObjectIdOrHexString(id)) ctx.throw(400, 'The object id is not valid');
  return next();
};
