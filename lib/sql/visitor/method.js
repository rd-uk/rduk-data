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

const errors = require('@rduk/errors');
const visitor = require('../expression/visitor');
const Visitor = require('./');

const methods = {
    filter: function(source, predicate) {
        let expression = visitor.visit(source);
        expression.where.push(predicate.body);
        return expression;
    },
    alias: function(source, alias) {
        let expression = visitor.visit(source);
        expression.from.alias = alias;
        return expression;
    }
}

class MethodExpressionVisitor extends Visitor  {
    constructor() {
        super();
    }
    visit(expression) {
        if (expression) {
            switch(expression.name) {
                case 'alias':
                case 'filter':
                    return methods[expression.name](expression.context, expression.args[0]);
                default:
                    errors.throwNotSupportedError(expression.name);
            }
        }
    }
}

module.exports = MethodExpressionVisitor;
