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

const Queryable = require('../../../queryable')
const EntityCollection = require('./iterable')

class EntityQueryable extends Queryable {
  constructor (expression, Entity, mapping) {
    super(expression)
    this.Entity = Entity
    this.mapping = mapping
  }
  _method (type, ...args) {
    let q = super._method(type, ...args)
    return new EntityQueryable(q.expression, this.Entity, this.mapping)
  }
  toArray (context, raw) {
    let promise = super.toArray(context)
    if (raw) {
      return promise
    }

    return promise.then(items => items.map(item => new this.Entity(item)))
  }
  toIterator (context) {
    return super.toArray(context)
      .then(items => EntityCollection.ofType(this.Entity).create(items))
  }
}

module.exports = EntityQueryable
