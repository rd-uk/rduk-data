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
const BaseVisitor = require('../../visitor/base');
const JoinExpression = require('../expression/join');

const methods = {
    select: function(source, selector) {
        let expression = this.visitor.visit(source);
        if (!Array.isArray(selector.args)) {
            selector.args = [selector.args];
        }
        expression.selectors.push(selector);
        return expression;
    },
    join: function(source, target, predicate, type) {
        let expression = this.visitor.visit(source);
        expression.joins.push(new JoinExpression(target, predicate, type));
        return expression;
    },
    filter: function(source, predicate) {
        let expression = this.visitor.visit(source);
        expression.where.push(predicate);
        return expression;
    },
    skip: function(source, offset) {
        let expression = this.visitor.visit(source);
        expression.offset = offset;
        return expression;
    },
    take: function(source, limit) {
        let expression = this.visitor.visit(source);
        expression.limit = limit;
        return expression;
    }
};

class MethodExpressionVisitor extends BaseVisitor  {
    visit(expression) {
        if (expression) {
            switch(expression.name) {
                case 'select':
                case 'filter':
                case 'skip':
                case 'take':
                    return methods[expression.name].call(this.provider, expression.context, expression.args[0]);
                case 'join':
                    return methods.join.call(
                        this.provider,
                        expression.context,
                        expression.args[0],
                        expression.args[1],
                        'INNER');
                default:
                    errors.throwNotSupportedError(expression.name);
            }
        }
    }
}

module.exports = MethodExpressionVisitor;
