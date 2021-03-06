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
const type = require('@rduk/configuration/lib/sections/field/type')
const BaseProvider = require('@rduk/provider/lib/base')

function getAbsolute (path) {
  return `${__dirname}/${path}`
}

function load (path, defaultPath) {
  return type.load(path || getAbsolute(defaultPath))
}

class BaseDataProvider extends BaseProvider {
  initialize () {
    let query = this.section.section.query || {}
    let visitor = load(query.visitor, 'sql/visitor/expression')
    let translator = load(query.translator, 'sql/translator/expression')
    let mixins = load(query.mixins, 'sql/mixins')
    let QueryProvider = load(query.provider, 'query/default')

    this.query = new QueryProvider(visitor, translator, mixins)
  }
  execute (command, parameters) {
    errors.throwNotImplementedError('execute')
  }
}

module.exports = BaseDataProvider
