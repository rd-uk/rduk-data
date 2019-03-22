# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.6.2 - 2019-03-22
- fix Entity SQL SELECT default generation

## 0.6.1 - 2019-03-15
- update `@rduk/configuration` to latest version (2.2.3)

## 0.6.0 - 2019-03-15
- add toIterator method to EntityCollection
- add orderBy and orderByDesc to queryable
- update `jasmine` to latest version (3.2.0)
- update `dotenv` to latest version (6.1.0)
- update `coveralls` to latest version (3.0.3)
- update `standard` to latest version (12.0.0)

## 0.5.4 - 2019-03-15
### Changed
- remove alias on DELETE

## 0.5.3 - 2018-08-03
### Changed
- manage distinct in queryable
- manage left join in queryable

## 0.5.2 - 2018-08-02
### Changed
- add custom toJSON method to BaseEntity

## 0.5.1 - 2018-07-13
### Changed
- add default mixins in default query provider

## 0.4.3 - 2018-07-10
### Changed
- update `@rduk/expression` to latest version (0.5.2)
- update `dotenv` to latest version (6.0.0)
- `@rduk/configuration` as peer dependency
- `@rduk/errors` as peer dependency
- `@rduk/logger` as peer dependency
- `@rduk/provider` as peer dependency

## 0.4.2 - 2018-05-29
### Changed
- override Custom Entity constructor name
- standard refactoring
- update `@rduk/expression` to latest version (0.5.1)
- update `@rduk/provider` to latest version (3.1.1)
- update `coveralls` to latest version (3.0.1)
- update `jasmine` to latest version (3.1.0)
- update `standard` to latest version (11.0.1)

## 0.4.1 - 2018-05-20
### Changed
- refactoring
- update `@rduk/configuration` with latest version (2.2.0)

## 0.4.0 - 2018-05-20
### Changed
- add DeleteExpression

## 0.3.0 - 2018-05-19
### Changed
- add schema generation from JSON file

## 0.2.2 - 2018-05-18
### Changed
- update `@rduk/expression` with latest version (0.4.0)

## 0.2.1 - 2018-01-29
### Changed
- update `@rduk/expression` with latest version (0.3.1)

## 0.2.0 - 2018-01-26s
### Changed
- add sql aggregate functions (min, max, avg, sum, count)

## 0.1.3 - 2018-01-26
### Changed
- fix QueryProvider type loading from configuration

## 0.1.2 - 2018-01-26
### Changed
- fix update sql generation: remove t0 alias from set part

## 0.1.1 - 2018-01-22
### Changed
- update `@rduk/expression` with latest version (0.3.0)
- raise code coverage to 100%

## 0.1.0 - 2018-01-21
### Changed
- adopt [`standard`](https://github.com/standard/standard#readme) style
