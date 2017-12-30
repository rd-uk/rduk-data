'use strict';

describe('ParseletCollection', function() {

    const errors = require('@rduk/errors');
    const ParseletCollection = require('../../../lib/utils/parser/parselet/collection');

    describe('add method', function() {

          let collection = new ParseletCollection;

          describe('called with null argument', function() {
              it('should throw an ArgumentNullError', function() {
                  expect(function() {
                      collection.add();
                  }).toThrowError(errors.ArgumentNullError);
              });
          });

          describe('called with invalid argument', function() {
              it('should throw an ArgumentError', function() {
                  expect(function() {
                      collection.add({});
                  }).toThrowError(errors.ArgumentError);
              });
          });

    })

});
