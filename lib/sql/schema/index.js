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

const mix = require('mixwith').mix

const EntityQueryable = require('./entity/queryable')

const FieldExpression = require('@rduk/expression/lib/parser/expression/field')
const LambdaExpression = require('@rduk/expression/lib/parser/expression/lambda')
const NameExpression = require('@rduk/expression/lib/parser/expression/name')
const ObjectLiteralExpression = require('@rduk/expression/lib/parser/expression/object')
const PropertyExpression = require('@rduk/expression/lib/parser/expression/property')
const SelectExpression = require('../expression/select')
const SourceExpression = require('../../expression/source')

const data = require('../../')
const BaseEntity = require('./entity/base')

let mixEntityBase = (info, properties, mapping, mixins) => (
  class extends mix(BaseEntity).with(
    mixins.insert,
    mixins.update,
    mixins.delete
  ) {
    constructor (entity) {
      super(info, properties, mapping)
      this._original = entity
      Object.keys(entity).forEach(k => {
        if (this._info.properties[k]) {
          this[k] = entity[k]
        }
      })
    }
  }
)

class EntityFactory {
  create (name, info) {
    let properties = Object.keys(info.properties)
    let mapping = Object.assign(...properties.map(k => ({ [info.properties[k].name || k]: k })))

    class Entity extends mixEntityBase(info, properties, mapping, data.getInstance().query.mixins) {
      save () {
        return super.save().then(items => {
          let item = items[0]
          return new Entity(Object.assign(...Object.keys(item).filter(k => !!this._mapping[k]).map(k => ({ [this._mapping[k]]: item[k] }))))
        })
      }
      static query () {
        let expression = new SelectExpression(new SourceExpression(info.table))

        expression.selectors = [
          new LambdaExpression(new ObjectLiteralExpression(Object.keys(mapping).map(k => (
            new FieldExpression(mapping[k], new PropertyExpression(new NameExpression(name), k))
          ))), [new NameExpression(name)])
        ]

        return new EntityQueryable(expression, Entity, mapping)
      }
    }

    Object.defineProperty(Entity, 'name', {
      get: () => name
    })

    return Entity
  }
}

class Schema {
  constructor (definition) {
    let factory = new EntityFactory()
    Object.keys(definition.entities).forEach(entityName => {
      let entity = factory.create(entityName, definition.entities[entityName])
      Object.defineProperty(this, entityName, {
        get: () => entity
      })
    })
  }
}

module.exports = Schema
