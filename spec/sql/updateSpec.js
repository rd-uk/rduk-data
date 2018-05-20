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

describe('update stmt generation', function () {
  it('should success', function () {
    const BinaryExpression = require('@rduk/expression/lib/parser/expression/binary')
    const FieldExpression = require('@rduk/expression/lib/parser/expression/field')
    const LambdaExpression = require('@rduk/expression/lib/parser/expression/lambda')
    const NameExpression = require('@rduk/expression/lib/parser/expression/name')
    const ObjectLiteralExpression = require('@rduk/expression/lib/parser/expression/object')
    const PropertyExpression = require('@rduk/expression/lib/parser/expression/property')
    const SourceExpression = require('../../lib/expression/source')
    const TokenType = require('@rduk/expression/lib/token/type')
    const UpdateExpression = require('../../lib/expression/update')

    const Translator = require('../../lib/sql/translator/expression')
    const Visitor = require('../../lib/sql/visitor/expression')
    const QueryProvider = require('../../lib/query/default')

    const provider = new QueryProvider(Visitor, Translator)

    let obj = new ObjectLiteralExpression([
      new FieldExpression('email', new PropertyExpression(new NameExpression('this'), 'email'))
    ])
    let assignment = new LambdaExpression(obj, [])

    let expression1 = new UpdateExpression(new SourceExpression('users'))
    let binary = new BinaryExpression(
            new PropertyExpression(new NameExpression('user'), 'id'),
            new PropertyExpression(new NameExpression('this'), 'id'),
            TokenType.EQEQEQ
        )
    let where = new LambdaExpression(binary, [new NameExpression('user')])
    expression1.where = where
    expression1.assignments.push(assignment)

    let command1 = provider.getCommand(expression1)
    expect(command1).toBe('UPDATE users AS t0 SET email = ?<email> WHERE (t0.id = ?<id>)')

    let expression2 = new UpdateExpression(new SourceExpression('users'))
    expression2.assignments.push(assignment)
    let command2 = provider.getCommand(expression2)
    expect(command2).toBe('UPDATE users AS t0 SET email = ?<email> WHERE true')
  })
})

describe('update from schema generation', function () {
  it('should success', async function (done) {
    const Schema = require('../../lib/sql/schema')
    const db = new Schema(require('../resources/db.json'))

    let user = new db.User({
      id: 1,
      email: 'tech@rduk.fr',
      lastName: 'UNG',
      undef: 'ignored'
    })
    let updated1 = await user.save()
    expect(updated1).toBeDefined()

    let link = new db.Link({
      fk1: 1,
      fk2: 1,
      value: 'test'
    })

    let updated2 = await link.save()
    expect(updated2).toBeDefined()
    done()
  })
})
