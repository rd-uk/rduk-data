const BinaryExpression = require('@rduk/expression/lib/parser/expression/binary')
const ConstantExpression = require('@rduk/expression/lib/parser/expression/constant')
const FieldExpression = require('@rduk/expression/lib/parser/expression/field')
const LambdaExpression = require('@rduk/expression/lib/parser/expression/lambda')
const NameExpression = require('@rduk/expression/lib/parser/expression/name')
const ObjectLiteralExpression = require('@rduk/expression/lib/parser/expression/object')
const PropertyExpression = require('@rduk/expression/lib/parser/expression/property')
const TokenType = require('@rduk/expression/lib/token/type')

const Queryable = require('../../queryable')
const SourceExpression = require('../../expression/source')

const data = require('../../')

const createEntity = (info, InsertExpression, UpdateExpression, DeleteExpression) => {
  InsertExpression = InsertExpression || data.getInstance().query.InsertExpression
  UpdateExpression = UpdateExpression || data.getInstance().query.UpdateExpression
  DeleteExpression = DeleteExpression || data.getInstance().query.DeleteExpression

  let properties = Object.keys(info.properties)

  class Entity {
    constructor (entity) {
      this._original = entity
      Object.keys(entity).forEach(k => {
        if (info.properties[k]) {
          this[k] = entity[k]
        }
      })
    }
    get pk () {
      let props = properties.filter(key => (info.properties[key].pk))
      return props.map(prop => ({
        name: prop,
        value: this[prop]
      }))
    }
    save () {
      let pk = this.pk
      if (pk && !!pk.filter(prop => (!!prop.value)).length) {
        return this._update(pk)
      }

      return this._create()
    }
    drop () {
      let pk = this.pk
      let expression = new DeleteExpression(new SourceExpression(info.table))
      let binary = pk.map(prop => (
        new BinaryExpression(
          new PropertyExpression(new NameExpression('item'), prop.name),
          new PropertyExpression(new NameExpression('this'), prop.name),
          TokenType.EQEQEQ)
      )).reduce((acc, cur) => (new BinaryExpression(cur, acc, TokenType.AND)), new ConstantExpression(1))
      let where = new LambdaExpression(binary, [new NameExpression('item')])

      expression.where = where

      return data.getInstance().query.execute(expression, this)
    }
    _create () {
      let expression = new InsertExpression(new SourceExpression(info.table))
      let obj = new ObjectLiteralExpression(
        properties.filter(prop => (!!this[prop])).map(prop => (
          new FieldExpression(info.properties[prop].name || prop, new PropertyExpression(new NameExpression('this'), prop)))))
      let assignment = new LambdaExpression(obj, [])

      expression.assignments.push(assignment)

      return data.getInstance().query.execute(expression, this)
    }
    _update (pk) {
      let expression = new UpdateExpression(new SourceExpression(info.table))
      let obj = new ObjectLiteralExpression(
        properties.filter(prop => (!!this[prop] && !!pk.filter(p => p.name !== prop).length)).map(prop => (
          new FieldExpression(info.properties[prop].name || prop, new PropertyExpression(new NameExpression('this'), prop)))))
      let assignment = new LambdaExpression(obj, [])
      let binary = pk.map(prop => (
        new BinaryExpression(
          new PropertyExpression(new NameExpression('item'), prop.name),
          new PropertyExpression(new NameExpression('this'), prop.name),
          TokenType.EQEQEQ)
      )).reduce((acc, cur) => (new BinaryExpression(cur, acc, TokenType.AND)), new ConstantExpression(1))
      let where = new LambdaExpression(binary, [new NameExpression('item')])

      expression.where = where
      expression.assignments.push(assignment)

      return data.getInstance().query.execute(expression, this)
    }
    static query () {
      return new Queryable(new SourceExpression(info.table))
    }
  }

  return Entity
}

class Schema {
  constructor (definition, InsertExpression, UpdateExpression) {
    Object.keys(definition.entities).forEach(entityName => {
      let entity = createEntity(definition.entities[entityName], InsertExpression, UpdateExpression)
      Object.defineProperty(this, entityName, {
        get: () => (entity)
      })
    })
  }
}

module.exports = Schema
