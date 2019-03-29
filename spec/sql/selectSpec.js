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

describe('select from schema generation', function () {
  it('should success', function (done) {
    const QueryProvider = require('../../lib/query/default')
    const Visitor = require('../../lib/sql/visitor/expression')
    const Translator = require('../../lib/sql/translator/expression')
    const Schema = require('../../lib/sql/schema')
    const db = new Schema(require('../resources/db.json'))

    let provider = new QueryProvider(Visitor, Translator, () => ({}))
    let query = db.User.query()
      .join(db.Profile.query(), (u, p) => u.id === p.userId)
      .filter((u, p) => p.birthdate < '2000-01-01')
      .select((u, p) => ({
        id: p.userId,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        birthdate: p.birthdate
      }))
      .skip(10)
      .take(10)

    let cmd = provider.getCommand(query.expression, {})
    expect(cmd).toBe('SELECT t1.user_id AS id, t0.email AS email, t0.first_name AS firstName, t0.last_name AS lastName, t1.birth_date AS birthdate FROM db_users AS t0 INNER JOIN db_profiles AS t1 ON (t0.id = t1.user_id) WHERE (true AND (t1.birth_date < \'2000-01-01\')) LIMIT 10 OFFSET 10')

    Promise.all([
      query
        .toIterator()
        .then(users => {
          for (let user of users) {
            expect(user.constructor.name).toBe('User')
          }
        }),
      query
        .toArray()
        .then(users => {
          expect(users.length).toBe(1)
          expect(users[0].email).toBe('john.doe@example.com')
          expect(users[0].birthdate).toBeUndefined()
          expect(users[0]._original.birthdate).toBeDefined()
          users.forEach(user => {
            expect(user.constructor.name).toBe('User')
            let json = user.toJSON()
            expect(json).toBeDefined()
          })
        }),
      query
        .toArray({}, true)
        .then(users => {
          expect(users.length).toBe(1)
          expect(users[0].email).toBe('john.doe@example.com')
          expect(users[0].birthdate).toBeDefined()
          users.forEach(user => {
            expect(user.constructor.name).toBe('Object')
          })
        })
    ]).then(() => done())
  })
})
