/**
 * MIT License
 *
 * Copyright (c) 2016 - 2018 RDUK <tech@rduk.fr>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

describe('parser', function() {

    const Lexer = require('../lib/utils/lexer');
    const LambdaParser = require('../lib/utils/parser/lambda');
    const LambdaExpression = require('../lib/utils/parser/expression/lambda');
    const NameExpression = require('../lib/utils/parser/expression/name');
    const BinaryExpression = require('../lib/utils/parser/expression/binary');

    describe('lambda', function() {

        it('should success', function() {
            let fn = user => (user.name.toLowerCase().contains('john') &&
              (user.age < 25 || user.age >= 30));
            let lex = new Lexer(fn.toString(), '!&|=><', '&|=>');
            let lambda = new LambdaParser(lex);
            let expression = lambda.parse();

            expect(expression).toBeDefined();
            expect(expression instanceof LambdaExpression).toBe(true);
            expect(expression.args instanceof NameExpression).toBe(true);
            expect(expression.body instanceof BinaryExpression).toBe(true);
            expect(expression.body.operator).toBe('&&');
            expect(expression.body.left.name).toBe('contains');
            expect(expression.body.right.operator).toBe('||');
            expect(expression.body.right.left.operator).toBe('<');
            expect(expression.body.right.right.operator).toBe('>=');
        });

        it('should success', function() {
            let fn = user => (user.rating > .5);
            let lex = new Lexer(fn.toString(), '!&|=><', '&|=>');
            let lambda = new LambdaParser(lex);
            let expression = lambda.parse();

            expect(expression).toBeDefined();
            expect(expression instanceof LambdaExpression).toBe(true);
            expect(expression.body instanceof BinaryExpression).toBe(true);
        });

        it('should throw an Error', function() {
            let lex = new Lexer('====', '!&|=><', '&|=>');
            let lambda = new LambdaParser(lex);

            expect(function() {
                lambda.parse();
            }).toThrowError();
        });

    });

});
