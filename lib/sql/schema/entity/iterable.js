class EntityCollection {
  constructor (Type, coll) {
    this.Type = Type
    this.coll = coll || []
  }
  * [Symbol.iterator] () {
    for (let i = 0; i < this.coll.length; i++) {
      yield new this.Type(this.coll[i])
    }
  }
}

module.exports = {
  ofType: (Type) => ({
    create: coll => new EntityCollection(Type, coll)
  })
}
