'use strict';

describe('Base SQL translator\'s', function() {
    describe('translate method', function() {
        it('should throw a NotImplementedError', function() {
            const errors = require('@rduk/errors');
            const BaseTranslator = require('../../../lib/sql/translator/base');
            let t = new BaseTranslator();
            expect(function() {
                t.translate();
            }).toThrowError(errors.NotImplementedError);
        });
    });
});
