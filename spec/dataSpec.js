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
    const QueryProvider = require('../lib/query/default');
    const visitor = require('../lib/sql/expression/visitor');
    const translator = require('../lib/sql/translator');
    const errors = require('@rduk/errors');

    let users, profiles;

    beforeEach(function() {
        users = new Queryable(new TableExpression('user'));
        profiles = new Queryable(new TableExpression('profile'));
    });

    it('sql generation should success', function() {
        let provider = new QueryProvider(visitor, translator);

        let q0 = users
        let command = provider.getCommand(q0.expression, {});
        expect(command).toBe('SELECT * FROM user AS t0  WHERE 1');

        let q1 = users
            .filter(u => u.email.toLowerCase() === this.email)
            .filter(u => (u.age > 25 && u.age <= 30) || (u.age >= 61 && u.age < 66))
        command = provider.getCommand(q1.expression, {email: 'j.doe@mail.test'});
        expect(command).toBe('SELECT * FROM user AS t0  WHERE ((1 AND (LOWER(t0.`email`) = ?<email>)) AND (((t0.`age` > 25) AND (t0.`age` <= 30)) OR ((t0.`age` >= 61) AND (t0.`age` < 66))))');

        let q2 = users
            .filter(u => u.email.toLowerCase() === this.email)
            .filter(u => u.email.endsWith('@test.com'));
        command = provider.getCommand(q2.expression, {email: 'j.doe@mail.test'});
        expect(command).toBe('SELECT * FROM user AS t0  WHERE ((1 AND (LOWER(t0.`email`) = ?<email>)) AND t0.`email` LIKE \'%@test.com\')');

        let q3 = users
            .filter(u => u.email.toLowerCase() !== this.email)
        command = provider.getCommand(q3.expression, {email: 'j.doe@mail.test'});
        expect(command).toBe('SELECT * FROM user AS t0  WHERE (1 AND (LOWER(t0.`email`) != ?<email>))');

        let q4 = users
            .filter(u => u.email.toLowerCase() != this.email)
        command = provider.getCommand(q4.expression, {email: 'j.doe@mail.test'});
        expect(command).toBe('SELECT * FROM user AS t0  WHERE (1 AND (LOWER(t0.`email`) != ?<email>))');

        let q5 = users
            .filter(u => u.email.toLowerCase() == this.email)
        command = provider.getCommand(q5.expression, {email: 'j.doe@mail.test'});
        expect(command).toBe('SELECT * FROM user AS t0  WHERE (1 AND (LOWER(t0.`email`) = ?<email>))');

        let q6 = users
            .filter(u => u.email.toLowerCase() === this.email)
            .filter(u => u.username.toUpperCase().contains('test'));
        command = provider.getCommand(q6.expression, {email: 'j.doe@mail.test'});
        expect(command).toBe('SELECT * FROM user AS t0  WHERE ((1 AND (LOWER(t0.`email`) = ?<email>)) AND UPPER(t0.`username`) LIKE \'%test%\')');

        let q7 = users
            .filter(u => u.email.toLowerCase() === this.email)
            .filter(u => u.username.toUpperCase().startsWith('test'));
        command = provider.getCommand(q7.expression, {email: 'j.doe@mail.test'});
        expect(command).toBe('SELECT * FROM user AS t0  WHERE ((1 AND (LOWER(t0.`email`) = ?<email>)) AND UPPER(t0.`username`) LIKE \'test%\')');

        let q8 = users
            .join(profiles, (u, p) => (u.id === p.userId))
            .select((u, p) => ({
                id: u.id,
                email: u.email,
                firstName: p.firstName,
                lastName: p.lastName.toUpperCase()
            }));

        command = provider.getCommand(q8.expression, {email: 'j.doe@mail.test'});
        expect(command).toBe('SELECT t0.`id` AS `id`, t0.`email` AS `email`, t1.`firstName` AS `firstName`, UPPER(t1.`lastName`) AS `lastName` FROM user AS t0 INNER JOIN profile AS t1 ON (t0.`id` = t1.`userId`) WHERE 1');
    });

    it('queryable.toArray should throw a NotImplementedError', function() {
        expect(function() {
            users
                .filter(u => u.email.toLowerCase() === this.email)
                .toArray({email: 'j.doe@mail.test'});
        }).toThrowError(errors.NotImplementedError);
    });

    it('queryable skip, take and orderBy should throw a NotSupportedError', function() {
        expect(function() {
            users.toArray();
        }).toThrowError(errors.NotImplementedError);

        expect(function() {
            users
                .skip(0)
                .toArray({email: 'j.doe@mail.test'});
        }).toThrowError(errors.NotSupportedError);

        expect(function() {
            users
                .take(10)
                .toArray({email: 'j.doe@mail.test'});
        }).toThrowError(errors.NotSupportedError);

        expect(function() {
            users
                .filter(u => (u.age > 25 && u.age <= 30) || (u.age >= 61 && u.age < 66))
                .filter(u => u.email.endsWith('@test.com'))
                .orderBy(u => (u.id))
                .toArray({email: 'j.doe@mail.test'});
        }).toThrowError(errors.NotSupportedError);
    });

    /*describe('unsupported operator', function() {
        it('should throw a NotSupportedError', function() {
            expect(function() {
                users
                    .select(u => ({
                        c: u.a - u.b
                    }))
                    .toArray();
            }).toThrowError(errors.NotSupportedError);
        });
    });*/

});
