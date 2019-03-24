# RDUK - Data

[![Build Status](https://travis-ci.org/rd-uk/rduk-data.svg?branch=master)](https://travis-ci.org/rd-uk/rduk-data)
[![Coverage Status](https://coveralls.io/repos/github/rd-uk/rduk-data/badge.svg?branch=master)](https://coveralls.io/github/rd-uk/rduk-data?branch=master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Greenkeeper badge](https://badges.greenkeeper.io/rd-uk/rduk-data.svg)](https://greenkeeper.io/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Create a QueryProvider responsible for creating queries and querying data source
thanks to a DataProvider

__Warning__: not prod ready.

## Installation

```sh
npm i --save rduk-data
```

## QueryProvider

### Implementations

#### SqlQueryProvider

```js
const Queryable = require('@rduk/data/lib/queryable');
const SourceExpression = require('@rduk/data/lib/expression/source');

let users = new Queryable(new SourceExpression('my_db_users'));
let profiles = new Queryable(new SourceExpression('my_db_profiles'));

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
 *  (1 AND (t0.`email` LIKE ? AND UPPER(t1.`country`) = 'FRANCE'))
 *
 * Parameters
 * { search: '%@rduk.fr' }
 */
```

## DataProvider

### Implementations

- [SQLite](https://github.com/rd-uk/rduk-data-sqlite) (wip)
- [PostgreSQL](https://github.com/rd-uk/rduk-data-pg) (wip)
- [MySQL](https://github.com/rd-uk/rduk-data-mysql) (wip)

## License

See [`LICENSE`](LICENSE) file
