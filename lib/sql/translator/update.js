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

const BaseTranslator = require('./base')

class UpdateTranslator extends BaseTranslator {
  translate (context) {
    let source = this.expression.source.name
    let set = this.translateColumns(context)
    let where = this.translateWhere(context)
    return `UPDATE ${source} AS t0 SET ${set} WHERE ${where}`
  }
  translateWhere (context) {
    if (!this.expression.where) {
      return 'true'
    }

    let expression = this.expression.where
    return this.provider.translator.translate(expression, context, expression.args)
  }
  translateColumns (context) {
    let assignments = this.translateAssignments(context)

    return assignments.map(a => {
      return `${a[0]} = ${a[1]}`
    }).join(', ')
  }
}

module.exports = UpdateTranslator
