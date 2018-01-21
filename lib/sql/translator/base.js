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

const flatten = require('../../utils/flatten')
const BaseTranslator = require('../../translator/base')

class SqlBaseTranslator extends BaseTranslator {
  translateAssignments (context) {
    if (!this.expression.assignments || !this.expression.assignments.length) {
      throw new Error('no value to assign')
    }

    let columns = flatten(this.expression.assignments).map(assignment => {
      let args = []
      return assignment.body.fields.map(field => ({
        name: field.name,
        value: this.provider.translator.translate(field.assignment, context, args)
      }))
    })

    return flatten(columns).map(c => {
      return [c.name, c.value]
    })
  }
}

module.exports = SqlBaseTranslator
