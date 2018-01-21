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

const errors = require('@rduk/errors')
const TokenType = require('@rduk/expression/lib/token/type')
const BaseTranslator = require('../../translator/base')

const SUPPORTED_OPERATORS = new Map()
SUPPORTED_OPERATORS.set(TokenType.AND, 'AND')
SUPPORTED_OPERATORS.set(TokenType.OR, 'OR')
SUPPORTED_OPERATORS.set(TokenType.EQEQ, '=')
SUPPORTED_OPERATORS.set(TokenType.EQEQEQ, '=')
SUPPORTED_OPERATORS.set(TokenType.NOTEQ, '!=')
SUPPORTED_OPERATORS.set(TokenType.NOTEQEQ, '!=')
SUPPORTED_OPERATORS.set(TokenType.LT, TokenType.LT)
SUPPORTED_OPERATORS.set(TokenType.LTE, TokenType.LTE)
SUPPORTED_OPERATORS.set(TokenType.GT, TokenType.GT)
SUPPORTED_OPERATORS.set(TokenType.GTE, TokenType.GTE)
SUPPORTED_OPERATORS.set(TokenType.PLUS, TokenType.PLUS)
SUPPORTED_OPERATORS.set(TokenType.MINUS, TokenType.MINUS)
SUPPORTED_OPERATORS.set(TokenType.ASTERISK, TokenType.ASTERISK)
SUPPORTED_OPERATORS.set(TokenType.SLASH, TokenType.SLASH)
SUPPORTED_OPERATORS.set(TokenType.PERCENT, (left, right) => `MOD(${left}, ${right})`)

class BinaryTranslator extends BaseTranslator {
  translate (context) {
    let operator = this.expression.operator

    if (!SUPPORTED_OPERATORS.has(operator)) {
      errors.throwNotSupportedError(`operator ${this.expression.operator}`)
    }

    return this.translateOperator(SUPPORTED_OPERATORS.get(operator), context)
  }
  translateOperator (operator, context) {
    let left = this.provider.translator.translate(this.expression.left, context, this.args)
    let right = this.provider.translator.translate(this.expression.right, context, this.args)

    if (typeof operator === 'function') {
      return operator(left, right)
    }

    return `(${left} ${operator} ${right})`
  }
}

module.exports = BinaryTranslator
