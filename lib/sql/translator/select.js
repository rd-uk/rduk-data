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

const ConstantExpression = require('@rduk/expression/lib/parser/expression/constant')
const BinaryExpression = require('@rduk/expression/lib/parser/expression/binary')
const TokenType = require('@rduk/expression/lib/token/type')
const BaseTranslator = require('../../translator/base')

const flatten = require('../../utils/flatten')

const getColumns = (list, provider, context) => flatten(list).map(selector => {
  let args = selector.args.map(a => a.name)
  return selector.body.fields.map(field => ({
    name: provider.translator.translate(field.assignment, context, args),
    alias: field.name
  }))
})

class SelectTranslator extends BaseTranslator {
  translate (context) {
    let from = this.expression.from.name
    let distinct = this.translateDistinct()
    let columns = this.translateColumns(context)
    let joins = this.translateJoins(context)
    let where = this.translateWhere(context)
    let group = this.translateGroups(context)
    let order = this.translateOrders(context)
    let limit = this.translateKey('limit', context)
    let offset = this.translateKey('offset', context)
    return `SELECT${distinct} ${columns} FROM ${from} AS t0 ${joins} WHERE ${where}${group}${order}${limit}${offset}`
  }
  translateDistinct () {
    return this.expression.distinct ? ' DISTINCT' : ''
  }
  translateWhere (context) {
    if (!this.expression.where.length) {
      return 'true'
    }

    let expression = this.expression.where.reduce((acc, cur) => {
      let expression = this.provider.translator.translate(cur, context, cur.args)
      return new BinaryExpression(acc, expression, TokenType.AND)
    }, new ConstantExpression(true))

    return this.provider.translator.translate(expression, context, expression.lambdaArgs)
  }
  translateJoins (context) {
    if (!this.expression.joins.length) {
      return ''
    }

    return this.expression.joins.map((join, index) => {
      return this.provider.translator.translate(join, context, [index + 1])
    }).join(' ')
  }
  translateColumns (context) {
    if (!this.expression.selectors.length) {
      return '*'
    }

    let columns = getColumns(this.expression.selectors, this.provider, context)

    return flatten(columns).map(c => {
      return `${c.name} AS ${c.alias}`
    }).join(', ')
  }
  translateGroups (context) {
    if (!this.expression.groups.length) {
      return ''
    }

    let columns = getColumns(this.expression.groups, this.provider, context)
    let group = flatten(columns).map(c => {
      return c.name
    }).join(', ')

    return ` GROUP BY ${group}`
  }
  translateOrders (context) {
    if (!this.expression.orders.length) {
      return ''
    }

    let columns = this.expression.orders.map(([selector, order]) => {
      return `${this.provider.translator.translate(selector)} ${order || 'ASC'}`
    })

    return ` ORDER BY ${columns.join(', ')}`
  }
  translateKey (key, context) {
    if (!this.expression[key]) {
      return ''
    }

    return ` ${key.toUpperCase()} ${this.expression[key]}`
  }
}

module.exports = SelectTranslator
