/**
 * API parser helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var path = require('path');
var extend = require('extend');

var Runtime = require('jsdoc/lib/jsdoc/util/runtime');
var Handlers = require('jsdoc/lib/jsdoc/src/handlers');
var JSDocParser = require('jsdoc/lib/jsdoc/src/parser');

/**
 * @construct
 */
var Parser = function()
{
    var rootPath = path.resolve(__dirname, '../../..');

    global.env = {
        conf: {
            encoding: 'utf8'
        },
        opts: {}
    };

    // Setup runtime env
    Runtime.initialize([
        path.join(rootPath, 'node_modules', 'jsdoc'), rootPath
    ]);

    // Bundle the JSDoc parser
    var parser = JSDocParser.createParser();

    // Extend this
    extend(this, parser);

    // Attach essentials
    Handlers.attachTo(parser);
};

module.exports = Parser;

