const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('should pass the validation for string field', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({
        name: 'Sed perspiciatis',
      });

      expect(errors).to.have.length(0);
    });

    it('should throw the error for string field: the value is too short', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({
        name: 'Lalala',
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('too short, expect 10, got 6');
    });

    it('should throw the error for string field: the value is too long', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({
        name: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('too long, expect 20, got 62');
    });

    it('should throw the error for string field: the value type is incompatible', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({
        name: 764,
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('expect string, got number');
    });

    it('should pass the validation for numeric field', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({
        age: 21,
      });

      expect(errors).to.have.length(0);
    });

    it('should throw the error for numeric field: the value is too little', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({
        age: 12,
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('too little, expect 18, got 12');
    });

    it('should throw the error for numeric field: the value is too big', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({
        age: 30,
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('too big, expect 27, got 30');
    });

    it('should throw the error for numeric field: the value type is incompatible', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({
        age: '30',
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('expect number, got string');
    });

    it('should throw the error for the field set', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({
        name: 'Lolal',
        age: 39,
      });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('too big, expect 27, got 39');
    });
  });
});
