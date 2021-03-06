'use strict';

/**
 * Module dependencies.
 */

const Test = require('mocha/lib/test');

/**
 * BDD-bundle interface:
 *
 *    bundle({foo: 'bar'}, function() {
 *      describe('Array', function() {
 *        describe('#indexOf()', function() {
 *          it('should return -1 when not present', function() {
 *            // ...
 *          });
 *
 *          it('should return the index when present', function() {
 *            // ...
 *          });
 *        });
 *      });
 *    });
 *
 * @param {Suite} suite Root suite.
 */
module.exports = function(suite) {
    const suites = [suite];

    suite.on('pre-require', function(context, file, mocha) {
        const common = require('mocha/lib/interfaces/common')(suites, context, mocha);

        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = common.afterEach;
        context.run = mocha.options.delay && common.runWithSuite(suite);

        context.bundle = require('./bundle')(common, suites, file, 'beforeEach', 'afterEach');

        /**
         * Describe a 'suite' with the given `title`
         * and callback `fn` containing nested suites
         * and/or tests.
         * @param {string} title
         * @param {function} fn
         *
         * @return {Suite}
         */
        context.describe = context.context = function(title, fn) {
            return common.suite.create({
                title: title,
                file: file,
                fn: fn,
            });
        };

        /**
         * Pending describe.
         * @param {string} title
         * @param {function} fn
         *
         * @return {Suite}
         */
        context.xdescribe = context.xcontext = context.describe.skip = function(title, fn) {
            return common.suite.skip({
                title: title,
                file: file,
                fn: fn,
            });
        };

        /**
         * Exclusive suite.
         * @param {string} title
         * @param {function} fn
         *
         * @return {Suite}
         */
        context.describe.only = function(title, fn) {
            return common.suite.only({
                title: title,
                file: file,
                fn: fn,
            });
        };

        /**
         * Describe a specification or test-case
         * with the given `title` and callback `fn`
         * acting as a thunk.
         * @param {string} title
         * @param {function} fn
         *
         * @return {Test}
         */
        context.it = context.specify = function(title, fn) {
            const suite = suites[0];
            if (suite.isPending()) {
                fn = null;
            }
            const test = new Test(title, fn);
            test.file = file;
            suite.addTest(test);
            return test;
        };

        /**
         * Exclusive test-case.
         * @param {string} title
         * @param {function} fn
         *
         * @return {Test}
         */
        context.it.only = function(title, fn) {
            return common.test.only(mocha, context.it(title, fn));
        };

        /**
         * Pending test case.
         * @param {string} title
         *
         * @return {Test}
         */
        context.xit = context.xspecify = context.it.skip = function(title) {
            return context.it(title);
        };

        /**
         * Number of attempts to retry.
         * @param {integer} n
         */
        context.it.retries = function(n) {
            context.retries(n);
        };
    });
};
