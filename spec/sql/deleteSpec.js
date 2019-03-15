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

describe('delete stmt generation', function () {
  it('should success', function () {
    const errors = require('@rduk/errors')
    const BinaryExpression = require('@rduk/expression/lib/parser/expression/binary')
    const LambdaExpression = require('@rduk/expression/lib/parser/expression/lambda')
    const NameExpression = require('@rduk/expression/lib/parser/expression/name')
    const PropertyExpression = require('@rduk/expression/lib/parser/expression/property')
    const SourceExpression = require('../../lib/expression/source')
    const TokenType = require('@rduk/expression/lib/token/type')
    const DeleteExpression = require('../../lib/expression/delete')

    const Translator = require('../../lib/sql/translator/expression')
    const Visitor = require('../../lib/sql/visitor/expression')
    const QueryProvider = require('../../lib/query/default')

    const provider = new QueryProvider(Visitor, Translator)

    let expression = new DeleteExpression(new SourceExpression('users'))

    expect(function () {
      console.log(provider.getCommand(expression))
    }).toThrowError(errors.NotSupportedError)

    let binary = new BinaryExpression(
      new PropertyExpression(new NameExpression('user'), 'id'),
      new PropertyExpression(new NameExpression('this'), 'id'),
      TokenType.EQEQEQ
    )
    let where = new LambdaExpression(binary, [new NameExpression('user')])
    expression.where = where

    let command = provider.getCommand(expression)
    expect(command).toBe('DELETE FROM users WHERE (id = ?<id>)')
  })
})

describe('delete from schema generation', function () {
  it('should success', function (done) {
    const Schema = require('../../lib/sql/schema')
    const db = new Schema(require('../resources/db.json'))

    let user = new db.User({
      id: 1
    })

    user.drop()
      .then(result => {
        expect(result).toBeDefined()
        done()
      })
  })
})
