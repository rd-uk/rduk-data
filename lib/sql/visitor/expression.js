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

'use strict'

const ExpressionVisitor = require('../../visitor/expression')

const MAPPER = new Map()
MAPPER.set('BinaryExpression', require('../visitor'))
MAPPER.set('ConstantExpression', require('../visitor'))
MAPPER.set('InsertExpression', require('../visitor'))
MAPPER.set('MethodExpression', require('../visitor/method'))
MAPPER.set('PropertyExpression', require('../visitor'))
MAPPER.set('SelectExpression', require('../visitor'))
MAPPER.set('SourceExpression', require('../visitor/source'))
MAPPER.set('UpdateExpression', require('../visitor'))

class SqlExpressionVisitor extends ExpressionVisitor {
  constructor (provider) {
    super(provider, MAPPER)
  }
}

module.exports = SqlExpressionVisitor
