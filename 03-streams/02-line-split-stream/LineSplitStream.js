const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.remainder = '';
  }

  _transform(chunk, _encoding, done) {
    const chunkStringified = this.remainder + chunk.toString();

    let line = '';
    for (const character of chunkStringified.split('')) {
      if (character === os.EOL) {
        this.push(line);
        line = '';
        continue;
      }

      line += character;
    }

    this.remainder = line;
    done();
  }

  _flush(done) {
    if (this.remainder) {
      this.push(this.remainder);
    }
    done();
  }
}

module.exports = LineSplitStream;
