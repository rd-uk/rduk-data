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

describe('data', function() {

    const Queryable = require('../lib/queryable');
    const TableExpression = require('../lib/sql/expression/table');
    const QueryProvider = require('../lib/sql/query');
    const errors = require('@rduk/errors');

    let query;

    beforeEach(function() {
        let users = new Queryable(new TableExpression('user'));
        query = users.as('u')
            .filter(u => u.email.toLowerCase() === this.email);
    });

    it('sql generation should success', function() {
      let provider = new QueryProvider();
      let command = provider.getCommand(query.expression, {email: 'j.doe@mail.test'});

      expect(command).toBeDefined();
      expect(command).toBe('SELECT * FROM user AS u WHERE (1 AND (LOWER(u.email) = ?<email>))')
    });

    it('queryable.toArray should throw a NotImplementedError', function() {
        expect(function() {
            query.toArray({email: 'j.doe@mail.test'});
        }).toThrowError(errors.NotImplementedError);
    });

    it('queryable select, skip, take and orderBy should throw a NotSupportedError', function() {
        expect(function() {
            query
                .select(u => ({
                  email: u.email
                }))
                .toArray({email: 'j.doe@mail.test'});
        }).toThrowError(errors.NotSupportedError);

        expect(function() {
            query
                .skip(0)
                .toArray({email: 'j.doe@mail.test'});
        }).toThrowError(errors.NotSupportedError);

        expect(function() {
            query
                .take(10)
                .toArray({email: 'j.doe@mail.test'});
        }).toThrowError(errors.NotSupportedError);

        expect(function() {
            query
                .orderBy(u => (u.id))
                .toArray({email: 'j.doe@mail.test'});
        }).toThrowError(errors.NotSupportedError);
    });

});
