'use strict';

describe('char', function() {

    let char = require('../../lib/utils/char');
    let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let digits = '0123456789';

    describe('isLetter', function() {

        describe('when letter passed as argument', function() {
            it('should success', function() {
                letters.split('').forEach(letter => {
                    expect(char.isLetter(letter)).toBe(true);
                });
            });
        });

        describe('when digit passed as argument', function() {
            it('should fail', function() {
                digits.split('').forEach(letter => {
                    expect(char.isLetter(letter)).toBe(false);
                });
            });
        });

    });

});
