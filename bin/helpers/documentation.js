/**
 * Section helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var extend = require('extend');
var path = require('path');
var util = require('util');
var wrench = require('wrench');
var greppy = require('greppy');
var greppyPath = greppy.helper.get('path');

var Markdown = require('./markdown');
var Section = require('./section');

/**
 * @construct
 *
 * @param {Object} options - Options object
 */
var Documentation = function(options)
{
    var rootPath = path.resolve(__dirname, '../..');

    var defaultOptions = {
        entry: '',
        inputPath: path.join(rootPath, 'docs', '%s'),
        buildPath: path.join(rootPath, 'build', '%s')
    };

    // Assemble the options
    this.options = extend({}, defaultOptions, options || {});

    // Replace paths
    this.options.inputPath = util.format(
        this.options.inputPath,
        this.options.entry
    );

    this.options.buildPath = util.format(
        this.options.buildPath,
        this.options.entry
    );

    // Find all index.json files
    this.list = greppyPath.list(this.options.inputPath);

    // Setup helpers
    this.markdown = new Markdown();
    this.section  = new Section(this.options);
};

/**
 * Build structure.
 *
 * @param {Array} paths - Array of paths we concat
 * @param {Object} section - Root Section object
 */
Documentation.prototype.buildStructure = function()
{
    var self = this;

    // Initalize the empty structure
    var struct = {};

    // Process the found files
    this.list.filter(function(item) {

        // Only process json files
        return /\.json$/i.test(item);

    }).map(function(item) {

        // Cleanup the path and get the dirname
        var item = item.replace(self.options.inputPath, '').replace(/^\//i, '');
        return path.dirname(item);

    }).sort().map(function(item) {

        // Sort paths - so we can build the hierarchy
        // Load the JSON file and extend it
        var resPath = path.join(self.options.inputPath, item);
        var res = require(resPath + '/index.json');
        res.parts = item.split('/');

        // Render markdown files for this entry
        res.content = self.markdown.renderFilesForPath(resPath);

        return res;

    }).forEach(function(item) {

        // Walk through all nodes and build up a hierarchy
        var cur = struct;

        for (var i = 0; i < item.parts.length; i++) {
            var part = item.parts[i];
            if (i === item.parts.length - 1) {
                cur[part] = {
                    _name: item.name,
                    _icon: item.icon,
                    _content: item.content
                };
                break;
            }
            if (!cur[part]) {
                cur[part] = {};
            }
            cur = cur[part];
        }
    });

    return struct;
};

/**
 * Build the documentation.
 *
 * @param {Array} paths - Array of paths we concat
 * @param {Object} section - Root Section object
 */
Documentation.prototype.build = function()
{
    // Build output directories
    wrench.mkdirSyncRecursive(this.options.buildPath);

    // Get structure
    var structure = this.buildStructure();

    // Render sections
    this.section.render(['/'], structure);
};

module.exports = Documentation;

