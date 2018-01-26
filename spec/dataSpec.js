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
const Queryable = require('../lib/queryable')
const SourceExpression = require('../lib/expression/source')

describe('data', function () {
  describe('base provider execute method', function () {
    const BaseProvider = require('../lib/base')

    it('should throw a NotImplementedError', function () {
      let provider = new BaseProvider({name: 'base'})
      expect(function () {
        provider.execute()
      }).toThrowError(errors.NotImplementedError)
    })
  })

  describe('query', function () {
    const QueryProvider = require('../lib/query/default')
    const Visitor = require('../lib/sql/visitor/expression')
    const Translator = require('../lib/sql/translator/expression')
    const errors = require('@rduk/errors')

    let users
    let profiles
    let followers

    beforeEach(function () {
      users = new Queryable(new SourceExpression('user'))
      profiles = new Queryable(new SourceExpression('profile'))
      followers = new Queryable(new SourceExpression('follower'))
    })

    it('sql generation should success', function () {
      let provider = new QueryProvider(Visitor, Translator)

      let q0 = users.skip(20).take(10)
      let cmd0 = provider.getCommand(q0.expression, {})
      expect(cmd0).toBe('SELECT * FROM user AS t0  WHERE true LIMIT 10 OFFSET 20')

      let q1 = users
              .filter(u => u.email.toLowerCase() === this.email)
              .filter(u => (u.age > 25 && u.age <= 30) || (u.age >= 61 && u.age < 66))
      let cmd1 = provider.getCommand(q1.expression, {email: 'j.doe@mail.test'})
      expect(cmd1).toBe('SELECT * FROM user AS t0  WHERE ((true AND (LOWER(t0.email) = ?<email>)) AND (((t0.age > 25) AND (t0.age <= 30)) OR ((t0.age >= 61) AND (t0.age < 66))))')

      let q2 = users
              .filter(u => u.email.toLowerCase() === this.email)
              .filter(u => u.email.endsWith('@test.com'))
      let cmd2 = provider.getCommand(q2.expression, {email: 'j.doe@mail.test'})
      expect(cmd2).toBe('SELECT * FROM user AS t0  WHERE ((true AND (LOWER(t0.email) = ?<email>)) AND t0.email LIKE \'%@test.com\')')

      let q3 = users
              .filter(u => u.email.toLowerCase() !== this.email)
              .skip(0)
      let cmd3 = provider.getCommand(q3.expression, {email: 'j.doe@mail.test'})
      expect(cmd3).toBe('SELECT * FROM user AS t0  WHERE (true AND (LOWER(t0.email) != ?<email>))')

      let q4 = users
              .filter(u => u.email.toLowerCase() != this.email) // eslint-disable-line
      let cmd4 = provider.getCommand(q4.expression, {email: 'j.doe@mail.test'})
      expect(cmd4).toBe('SELECT * FROM user AS t0  WHERE (true AND (LOWER(t0.email) != ?<email>))')

      let q5 = users
              .filter(u => u.email.toLowerCase() == this.email) // eslint-disable-line
      let cmd5 = provider.getCommand(q5.expression, {email: 'j.doe@mail.test'})
      expect(cmd5).toBe('SELECT * FROM user AS t0  WHERE (true AND (LOWER(t0.email) = ?<email>))')

      let q6 = users
              .filter(u => u.email.toLowerCase() === this.email)
              .filter(u => u.username.toUpperCase().contains('test'))
      let cmd6 = provider.getCommand(q6.expression, {email: 'j.doe@mail.test'})
      expect(cmd6).toBe('SELECT * FROM user AS t0  WHERE ((true AND (LOWER(t0.email) = ?<email>)) AND UPPER(t0.username) LIKE \'%test%\')')

      let q7 = users
              .filter(u => u.email.toLowerCase() === this.email)
              .filter(u => u.email.toLowerCase().contains(this.host))
              .filter(u => u.username.toUpperCase().startsWith('test'))
      let cmd7 = provider.getCommand(q7.expression, {email: 'j.doe@mail.test', host: 'mail.test'})
      expect(cmd7).toBe('SELECT * FROM user AS t0  WHERE (((true AND (LOWER(t0.email) = ?<email>)) AND LOWER(t0.email) LIKE ?<host>) AND UPPER(t0.username) LIKE \'test%\')')

      let q8 = users
              .join(profiles, (u, p) => (u.id === p.userId))
              .select((u, p) => ({
                id: u.id
              }))

      let cmd8 = provider.getCommand(q8.expression, {email: 'j.doe@mail.test'})
      expect(cmd8).toBe('SELECT t0.id AS id FROM user AS t0 INNER JOIN profile AS t1 ON (t0.id = t1.userId) WHERE true')

      let q9 = users
              .join(profiles, (u, p) => (u.id === p.userId))
              .select((u, p) => ({
                id: u.id,
                email: u.email,
                firstName: p.firstName,
                lastName: p.lastName.toUpperCase()
              }))

      let cmd9 = provider.getCommand(q9.expression, {email: 'j.doe@mail.test'})
      expect(cmd9).toBe('SELECT t0.id AS id, t0.email AS email, t1.firstName AS firstName, UPPER(t1.lastName) AS lastName FROM user AS t0 INNER JOIN profile AS t1 ON (t0.id = t1.userId) WHERE true')

      // test modulo
      let q10 = users
        .select(u => ({
          test: 9 % 2
        }))
      let cmd10 = provider.getCommand(q10.expression)
      expect(cmd10).toBe('SELECT MOD(9, 2) AS test FROM user AS t0  WHERE true')

      let q11 = profiles
        .join(followers, (p, f) => (p.id === f.profileId))
        .groupBy((p) => ({
          id: p.id
        }))
        .select((p, f) => ({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          followers: f.id.count()
        }))
      let cmd11 = provider.getCommand(q11.expression)
      expect(cmd11).toBe('SELECT t0.id AS id, t0.firstName AS firstName, t0.lastName AS lastName, COUNT(t1.id) AS followers FROM profile AS t0 INNER JOIN follower AS t1 ON (t0.id = t1.profileId) WHERE true GROUP BY t0.id')

      let q12 = profiles
        .join(followers, (p, f) => (p.id === f.profileId))
        .join(profiles, (p1, f, p2) => (f.followerId === p2.id))
        .groupBy((p1, f, p2) => ({
          id: p1.id,
          gender: p2.gender
        }))
        .select((p1, f, p2) => ({
          id: p1.id,
          firstName: p1.firstName,
          lastName: p1.lastName,
          gender: p2.gender,
          followers: f.id.count()
        }))
      let cmd12 = provider.getCommand(q12.expression)
      expect(cmd12).toBe('SELECT t0.id AS id, t0.firstName AS firstName, t0.lastName AS lastName, t2.gender AS gender, COUNT(t1.id) AS followers FROM profile AS t0 INNER JOIN follower AS t1 ON (t0.id = t1.profileId) INNER JOIN profile AS t2 ON (t1.followerId = t2.id) WHERE true GROUP BY t0.id, t2.gender')
    })

    it('queryable.toArray to return empty array', function (done) {
      users
        .filter(u => u.email.toLowerCase() === this.email)
        .toArray({email: 'j.doe@mail.test'})
        .then(result => {
          expect(Array.isArray(result)).toBe(true)
          expect(result.length).toBe(0)
          done()
        })
    })

    it('queryable orderBy should throw a NotSupportedError', function () {
      expect(function () {
        users
                  .filter(u => (u.age > 25 && u.age <= 30) || (u.age >= 61 && u.age < 66))
                  .filter(u => u.email.endsWith('@test.com'))
                  .orderBy(u => (u.id))
                  .toArray({email: 'j.doe@mail.test'})
      }).toThrowError(errors.NotSupportedError)
    })
  })

  describe('queryable first', function () {
    it('should return the first element', function (done) {
      let context = {}
      let q11 = new Queryable(new SourceExpression('q11'))
      spyOn(q11, 'skip').and.returnValue(q11)
      spyOn(q11, 'take').and.returnValue(q11)
      spyOn(q11, 'toArray').and.returnValue(Promise.resolve(['test']))
      q11.first(context)
        .then(result => {
          expect(q11.skip).toHaveBeenCalledWith(0)
          expect(q11.take).toHaveBeenCalledWith(1)
          expect(q11.toArray).toHaveBeenCalledWith(context)
          expect(result).toBe('test')
          done()
        })
    })
  })

  describe('queryable single', function () {
    describe('if only one element returned by toArray', function () {
      it('should return the element ', function (done) {
        let context = {}
        let q12 = new Queryable(new SourceExpression('q12'))
        spyOn(q12, 'skip').and.returnValue(q12)
        spyOn(q12, 'take').and.returnValue(q12)
        spyOn(q12, 'toArray').and.returnValue(Promise.resolve(['test']))
        q12.single(context)
          .then(result => {
            expect(q12.skip).toHaveBeenCalledWith(0)
            expect(q12.take).toHaveBeenCalledWith(2)
            expect(q12.toArray).toHaveBeenCalledWith(context)
            expect(result).toBe('test')
            done()
          })
      })
    })

    describe('if more than one element returned by toArray', function () {
      it('should reject the Promise', function (done) {
        let context = {}
        let q13 = new Queryable(new SourceExpression('q13'))
        spyOn(q13, 'skip').and.returnValue(q13)
        spyOn(q13, 'take').and.returnValue(q13)
        spyOn(q13, 'toArray').and.returnValue(Promise.resolve(['test 1', 'test 2']))
        q13.single(context)
          .catch(err => {
            expect(err.message).toBe('Not one and only one element.')
            done()
          })
      })
    })
  })
})
