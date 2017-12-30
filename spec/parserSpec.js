'use strict';

describe('parser', function() {

    const Lexer = require('../lib/utils/lexer');
    const LambdaParser = require('../lib/utils/parser/lambda');
    const LambdaExpression = require('../lib/utils/parser/expression/lambda');
    const NameExpression = require('../lib/utils/parser/expression/name');
    const BinaryExpression = require('../lib/utils/parser/expression/binary');

    describe('lambda', function() {

        it('should success', function() {
            let fn = user => (user.name.toLowerCase().contains('kim') && (user.age < 25 || user.age >= 30));
            let lex = new Lexer(fn.toString(), '!&|=><', '&|=>');
            let lambda = new LambdaParser(lex);
            let expression = lambda.parse();

            expect(expression).toBeDefined();
            expect(expression instanceof LambdaExpression).toBe(true);
            expect(expression.args instanceof NameExpression).toBe(true);
            expect(expression.body instanceof BinaryExpression).toBe(true);
            expect(expression.body.operator).toBe('&&');
            expect(expression.body.left.name).toBe('contains');
            expect(expression.body.right.operator).toBe('||');
            expect(expression.body.right.left.operator).toBe('<');
            expect(expression.body.right.right.operator).toBe('>=');
        });

    });

});
