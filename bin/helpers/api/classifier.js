/**
 * Classifier helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var extend = require('extend');
var slug = require('slug');
var path = require('path');

var Signature = require('./signature');

/**
 * @construct
 *
 * @param {String} [basePath] - Base path we can strip off
 */
var Classifier = function(basePath)
{
    this.basePath = basePath || '';
};

/**
 * Strip undocumented elements.
 *
 * @param {Array} blocks - Analysed code blocks
 * @return {Array} blocks
 */
Classifier.prototype.strip = function(blocks)
{
    var self = this;

    return blocks.filter(function(item) {

        // Only pass documented blocks
        return !item.undocumented;

    }).map(function(item) {

        if (!item.meta) {
            return item;
        }

        // Aliasing
        item.filename = item.meta.filename;
        item.path = item.meta.path;
        item.lineno = item.meta.lineno;
        item.range = item.meta.range;

        if (item.meta.code && item.meta.code.node) {
            item.loc = item.meta.code.node.loc;
        } else {
            item.loc = {};
        }

        item.position = 'L' + item.lineno;

        if (item.loc.end) {
            item.position += '-L' + item.loc.end.line;
        }

        // Remove unneeded extras
        delete item.comment;
        delete item.meta;
        item.path = item.path.replace(self.basePath, '')
                             .replace(/^\//, '');

        // Strip off any method
        return JSON.parse(JSON.stringify(item));
    });
};

/**
 * Setup a classified module.
 *
 * @param {Array} blocks - Analysed code blocks
 * @return {Object} module
 */
Classifier.prototype.classify = function(blocks)
{
    var blocks = this.strip(blocks);

    // Setup a class map
    var classes = {};

    // Find all classes
    blocks.forEach(function(item, idx) {

        if ('class' === item.kind) {

            classes[item.longname] = {
                methods: []
            };

            var longname = item.longname.split('/').pop().replace('~', '-');
            item.slug = slug(longname).toLowerCase();

            extend(classes[item.longname], item);
        }
    });

    // Find all methods
    blocks.forEach(function(item, idx) {

        if ('function' === item.kind && 'instance' === item.scope) {

            var signature = new Signature(item);
            item.signature = signature.get();

            var memberof = item.memberof.split('~').pop();
            item.slug = slug(memberof + '-' + item.name).toLowerCase();

            if (!item.params) {
                item.params = [];
            }

            if (!item.returns) {
                item.returns = [];
            }

            try {
                classes[item.memberof].methods.push(item);
            } catch (e) {
                // console.log(classes);
                // console.log(item.memberof);
                // console.log(item);
                // console.log(e.stack);
                // throw e;
            }
        }
    });

    // Setup module map
    var modules = {};

    // Find all modules
    blocks.forEach(function(item, idx) {
        if ('module' === item.kind) {
            modules[item.longname] = {
                classes: []
            };
            extend(modules[item.longname], item);
        }
    });

    // Classify all classes into their corresponding modules
    Object.keys(classes).forEach(function(key) {
        var classObj = classes[key];
        try {
            modules[classObj.memberof].classes.push(classObj);
        } catch (e) {
            // console.log(Object.keys(modules));
            // console.log(classObj);
            // console.log(key);
            // console.log(e.stack);
        }
    });

    // Remap modules from a map to a array
    var modules = Object.keys(modules).map(function(key) {

        // Alias the module
        var module = modules[key];

        // Setup parts map
        module.parts = module.path.split('/');

        // @TODO: Remove this return
        // return {
        //     parts: module.parts,
        //     longname: module.longname
        // };

        return module;
    });

    return modules;
};

module.exports = Classifier;

