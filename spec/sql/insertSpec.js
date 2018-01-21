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

describe('insert stmt generation', function () {
  it('should success', function () {
    const FieldExpression = require('@rduk/expression/lib/parser/expression/field')
    const LambdaExpression = require('@rduk/expression/lib/parser/expression/lambda')
    const NameExpression = require('@rduk/expression/lib/parser/expression/name')
    const ObjectLiteralExpression = require('@rduk/expression/lib/parser/expression/object')
    const PropertyExpression = require('@rduk/expression/lib/parser/expression/property')
    const SourceExpression = require('../../lib/expression/source')
    const InsertExpression = require('../../lib/sql/expression/insert')

    const Translator = require('../../lib/sql/translator/expression')
    const Visitor = require('../../lib/sql/visitor/expression')
    const QueryProvider = require('../../lib/query/default')

    const provider = new QueryProvider(Visitor, Translator)

    let expression = new InsertExpression(new SourceExpression('users'))
    let obj = new ObjectLiteralExpression([
      new FieldExpression('email', new PropertyExpression(new NameExpression('this'), 'email')),
      new FieldExpression('username', new PropertyExpression(new NameExpression('this'), 'username')),
      new FieldExpression('password', new PropertyExpression(new NameExpression('this'), 'password'))
    ])
    let assignment = new LambdaExpression(obj, [])
    expression.assignments.push(assignment)

    let command = provider.getCommand(expression)
    expect(command).toBe('INSERT INTO users (email, username, password) VALUES (?<email>, ?<username>, ?<password>)')
  })
})
