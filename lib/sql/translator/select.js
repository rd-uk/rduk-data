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

class SelectTranslator {
    constructor(expression) {
        this.expression = expression;
    }
    translate(context) {
        let from = this.expression.from.name;
        let alias = this.expression.from.alias;
        let columns = this.translateColumns(alias, context);
        let where = this.translateWhere(context);
        return `SELECT ${columns} FROM ${from} AS ${alias} WHERE ${where}`;
    }
    translateWhere(context) {
        if (!this.expression.where.length) {
            return 1;
        }

        let expression = this.expression.where.reduce((acc, cur) => {
            return new BinaryExpression(acc, cur, TokenType.AND);
        }, new ConstantExpression(1));

        return translator.translate(expression, context);
    }
    translateColumns(alias, context) {
        if (!this.expression.columns.length) {
            return '*';
        }

        return this.expression.columns.map(column => {
            return `${alias}.${column.name} AS ${column.alias}`;
        }).join(', ');
    }
}

module.exports = SelectTranslator;
