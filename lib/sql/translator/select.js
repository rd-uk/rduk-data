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

const ConstantExpression = require('@rduk/expression/lib/parser/expression/constant');
const BinaryExpression = require('@rduk/expression/lib/parser/expression/binary');
const TokenType = require('@rduk/expression/lib/token/type');
const translator = require('./');
const BaseTranslator = require('./base');

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

class SelectTranslator extends BaseTranslator {
    constructor(expression, args) {
        super(expression, args);
    }
    translate(context) {
        let from = this.expression.from.name;
        let columns = this.translateColumns(context);
        let joins = this.translateJoins(context);
        let where = this.translateWhere(context);
        return `SELECT ${columns} FROM ${from} AS t0 ${joins} WHERE ${where}`;
    }
    translateWhere(context) {
        if (!this.expression.where.length) {
            return 1;
        }

        let expression = this.expression.where.reduce((acc, cur) => {
            let expression = translator.translate(cur, context, cur.args);
            return new BinaryExpression(acc, expression, TokenType.AND);
        }, new ConstantExpression(1));

        return translator.translate(expression, context, expression.lambdaArgs);
    }
    translateJoins(context) {
        if (!this.expression.joins.length) {
            return '';
        }

        return this.expression.joins.map((join, index) => {
            return translator.translate(join, context, index + 1);
        }).join(' ');
    }
    translateColumns(context) {
        if (!this.expression.selectors.length) {
            return '*';
        }

        let columns = flatten(this.expression.selectors).map(selector => {
            let args = selector.args.map(a => a.name);
            return selector.body.fields.map(field => ({
                name: translator.translate(field.assignment, context, args),
                alias: field.name
            }));
        });

        return flatten(columns).map(c => {
            return `${c.name} AS \`${c.alias}\``
        }).join(', ');
    }
}

module.exports = SelectTranslator;