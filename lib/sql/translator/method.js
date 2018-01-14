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

const errors = require('@rduk/errors');
const translator = require('./');
const BaseTranslator = require('./base');

function strip(str) {
    return str.substring(1, str.length - 1);
}

class MethodTranslator extends BaseTranslator {
    constructor(expression, args) {
        super(expression, args);
    }
    translate(context) {
        let left = translator.translate(this.expression.context, context, this.args);
        let args = this.expression.args.map(arg => {
            return translator.translate(arg, context, this.args);
        });

        let method = this.expression.name;
        switch(method) {
            case 'endsWith':
                return this.translateLike(left, args[0], '%', '', context);
            case 'startsWith':
                return this.translateLike(left, args[0], '', '%', context);
            case 'contains':
                return this.translateLike(left, args[0], '%', '%', context);
            case 'toLowerCase':
                return this.translateLower(left);
            case 'toUpperCase':
                return this.translateUpper(left);
            default:
                errors.throwNotSupportedError(`method ${method}`)
        }
    }
    translateLike(column, search, prefix, suffix) {
        let match = /\?<([^>]+)>/g.exec(search);

        if (match) {
            context[match[1]] = `${prefix}${context[match[1]]}${suffix}`;
        } else {
            search = `'${prefix}${strip(search)}${suffix}'`;
        }

        return `${column} LIKE ${search}`;
    }
    translateLower(column) {
        return `LOWER(${column})`;
    }
    translateUpper(column) {
        return `UPPER(${column})`;
    }
}

module.exports = MethodTranslator;
