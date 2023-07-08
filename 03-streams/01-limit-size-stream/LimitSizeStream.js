const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.size = 0;
  }

  _transform(chunk, _encoding, callback) {
    this.size += chunk.length;
    const data = chunk.toString();

    if (this.size > this.limit) {
      return callback(new LimitExceededError());
    } else {
      callback(null, data);
    }
  }
}

module.exports = LimitSizeStream;
