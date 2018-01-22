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

/* eslint-env jasmine */

'use strict'

const errors = require('@rduk/errors')
const ConstantExpression = require('@rduk/expression/lib/parser/expression/constant')
const MethodExpression = require('@rduk/expression/lib/parser/expression/method')
const MethodTranslator = require('../../../lib/sql/translator/method')

describe('MethodTranslator:', function () {
  describe('translating unsupported operator', function () {
    it('should throw a NotSupportedError', function () {
      let expression = new MethodExpression({context: new ConstantExpression(42)}, 'unsupported', [])
      let provider = {
        translator: {
          translate: () => 'dummy content'
        }
      }
      let translator = new MethodTranslator(expression, [], provider)

      expect(function () {
        translator.translate({})
      }).toThrowError(errors.NotSupportedError)
    })
  })
})
