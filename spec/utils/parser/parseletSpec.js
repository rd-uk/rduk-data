'use strict';

describe('parselet', function() {

    const errors = require('@rduk/errors');
    const PrefixParselet = require('../../../lib/utils/parser/parselet/prefix');
    const InfixParselet = require('../../../lib/utils/parser/parselet/infix');
    const BinaryParselet = require('../../../lib/utils/parser/parselet/binary');

    describe('prefix', function() {
        describe('parse method called directly', function() {
            it('should throw a NotImplementedError', function() {
                expect(function() {
                    let prefix = new PrefixParselet();
                    prefix.parse();
                }).toThrowError(errors.NotImplementedError);
            });
        });
    });

    describe('infix', function() {
        describe('parse method called directly', function() {
            it('should throw a NotImplementedError', function() {
                expect(function() {
                    let infix = new InfixParselet();
                    infix.parse();
                }).toThrowError(errors.NotImplementedError);
            });
        });
    });

    describe('binary', function() {
        describe('instantiate without precedence arg', function() {
            it('should initialize precedence at 50', function() {
                let binary = new BinaryParselet('test');
                expect(binary.precedence).toBe(50);
            });
        })
    });

});
