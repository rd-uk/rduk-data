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

const BinaryExpression = require('@rduk/expression/lib/parser/expression/binary')
const LambdaExpression = require('@rduk/expression/lib/parser/expression/lambda')
const NameExpression = require('@rduk/expression/lib/parser/expression/name')
const PropertyExpression = require('@rduk/expression/lib/parser/expression/property')
const TokenType = require('@rduk/expression/lib/token/type')

const SourceExpression = require('../../../expression/source')

class BaseEntity {
  constructor (info, properties, mapping) {
    this._info = info
    this._properties = properties
    this._mapping = mapping
  }
  get pk () {
    let props = this._properties.filter(key => (this._info.properties[key].pk))
    return props.map(prop => ({
      name: prop,
      value: this[prop]
    }))
  }
  save () {
    let promise
    let pk = this.pk
    if (pk && !!pk.filter(prop => !!prop.value).length) {
      promise = this._update(pk)
    } else {
      promise = this._create()
    }

    return promise
  }
  drop () {
    return this._delete(this.pk)
  }
  _generateWhere (pk) {
    let binary = pk.map(prop => (
      new BinaryExpression(
        new PropertyExpression(new NameExpression('item'), prop.name),
        new PropertyExpression(new NameExpression('this'), prop.name),
        TokenType.EQEQEQ)
    )).reduce((acc, cur) => {
      return new BinaryExpression(cur, acc, TokenType.AND)
    })
    return new LambdaExpression(binary, [new NameExpression('item')])
  }
  _create () {
    errors.throwNotImplementedError('_create')
  }
  _update (pk) {
    errors.throwNotImplementedError('_update')
  }
  _delete (pk) {
    errors.throwNotImplementedError('_delete')
  }
  get source () {
    return new SourceExpression(this._info.table)
  }
  toJSON () {
    return Object.assign(...this._properties
      .filter(prop => !!this[prop] && this._info.properties[prop].serializable !== false)
      .map(prop => ({
        [prop]: this[prop]
      })))
  }
}

module.exports = BaseEntity
