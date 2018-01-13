# RDUK - Data

[![Build Status](https://travis-ci.org/rd-uk/rduk-data.svg?branch=master)](https://travis-ci.org/rd-uk/rduk-data)
[![Coverage Status](https://coveralls.io/repos/github/rd-uk/rduk-data/badge.svg?branch=master)](https://coveralls.io/github/rd-uk/rduk-data?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/rd-uk/rduk-data/badges/score.svg)](https://www.bithound.io/github/rd-uk/rduk-data)

Create a QueryProvider responsible for creating queries and querying data source
thanks to a DataProvider

__Warning__: not prod ready.

# QueryProvider

## Implementations

### SqlQueryProvider

```js
const Queryable = require('@rduk/data/lib/queryable');
const TableExpression = require('@rduk/data/lib/sql/expression/table');

let users = new Queryable(new TableExpression('my_db_users'));
let profiles = new Queryable(new TableExpression('my_db_profiles'));

let query = users
    .join(profiles, (u, p) => (u.id === p.user_id))
    .filter((u, p) => (u.email.endsWith(this.search) && p.country.toUpperCase() === 'FRANCE'))
    .select((u, p) => ({
        id: u.id,
        email: u.email,
        firstName: p.first_name,
        lastName: p.last_name.toUpperCase()
    }));

query.toArray({
    search: '@rduk.fr'
});

/**
 * Generated SQL query:
 * SELECT
 *   t0.`id` AS `id`,
 *   t0.`email` AS `email`,
 *   t1.`first_name` AS `firstName`,
 *   t1.`last_name` AS `lastName`
 * FROM my_db_users t0
 * INNER JOIN my_db_profiles t1 ON t0.id = t1.user_id
 * WHERE
 *  (1 && (t0.`email` LIKE '%?' AND UPPER(t1.`country`) = 'FRANCE'))
 */
```

# DataProvider

## Implementations

work in progress
