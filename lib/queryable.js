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

const data = require('./');
const Expression = require('@rduk/expression');
const MethodExpression = require('@rduk/expression/lib/parser/expression/method');
const TokenType = require('@rduk/expression/lib/token/type');

class Queryable {
    constructor(expression) {
        this.expression = expression;
    }
    filter(predicate) {
        let expression = new MethodExpression(
            this.expression,
            'filter', [Expression.lambda.parse(predicate)]);
        return new Queryable(expression);
    }
    select(selector) {
        let expression = new MethodExpression(
            this.expression,
            'select', [Expression.lambda.parse(selector)]);
        return new Queryable(expression);
    }
    orderBy(selector) {
        let expression = new MethodExpression(
            this.expression,
            'orderBy', [Expression.lambda.parse(selector)]);
        return new Queryable(expression);
    }
    take(count) {
        let expression = new MethodExpression(
            this.expression,
            'take', [count]);
        return new Queryable(expression);
    }
    skip(count) {
        let expression = new MethodExpression(
            this.expression,
            'skip', [count]);
        return new Queryable(expression);
    }
    as(alias) {
        let expression = new MethodExpression(
            this.expression,
            'alias', [alias]);
        return new Queryable(expression);
    }
    toArray(context) {
        return data.getInstance().query.execute(this.expression, context);
    }
}

module.exports = Queryable;
