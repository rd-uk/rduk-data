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

const logger = require('@rduk/logger');
const ExpressionTranslator = require('../../translator/expression');

const MAPPER = new Map();
MAPPER.set('BinaryExpression', require('../translator/binary'));
MAPPER.set('SelectExpression', require('../translator/select'));
MAPPER.set('LambdaExpression', require('../translator/lambda'));
MAPPER.set('MethodExpression', require('../translator/method'));
MAPPER.set('PropertyExpression', require('../translator/property'));
MAPPER.set('NameExpression', require('../translator/name'));
MAPPER.set('ConstantExpression', require('../translator/constant'));
MAPPER.set('String', require('../translator/string'));
MAPPER.set('JoinExpression', require('../translator/join'));
MAPPER.set('InsertExpression', require('../translator/insert'));
MAPPER.set('UpdateExpression', require('../translator/update'));

class SqlExpressionTranslator extends ExpressionTranslator {
    constructor(provider) {
        super(provider, MAPPER);
    }
}

module.exports = SqlExpressionTranslator;
