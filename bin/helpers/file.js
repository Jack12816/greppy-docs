/**
 * File documentation helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var extend = require('extend');
var path = require('path');
var util = require('util');
var wrench = require('wrench');
var greppy = require('greppy');

var Markdown = require('./markdown');
var Section = require('./section');

/**
 * @construct
 *
 * @param {Object} options - Options object
 */
var File = function(options)
{
    var rootPath = path.resolve(__dirname, '../..');

    var defaultOptions = {
        entry: '',
        inputPath: path.join(rootPath, '%s.md'),
        buildPath: path.join(rootPath, 'build', '%s'),
        breadcrumbs: []
    };

    // Assemble the options
    this.options = extend({}, defaultOptions, options || {});

    // Replace paths
    if (this.options.inputPath.contains('%s')) {
        this.options.inputPath = util.format(
            this.options.inputPath,
            this.options.entry
        );
    }

    if (this.options.buildPath.contains('%s')) {
        this.options.buildPath = util.format(
            this.options.buildPath,
            this.options.entry
        );
    }

    // Setup helpers
    this.markdown = new Markdown();
    this.section  = new Section(this.options);
};

/**
 * Build structure.
 */
File.prototype.buildStructure = function()
{
    var self = this;

    // Initalize the empty structure
    var struct = {};

    struct._name = this.options.entry.capitalize();
    struct._path = util.format('/%.html', this.options.entry);
    struct._icon = this.options.icon;
    struct._content = this.markdown.renderFiles(this.options.inputPath, {
        name: struct._name
    });

    return struct;
};

/**
 * Build the documentation.
 */
File.prototype.build = function()
{
    // Build output directories
    wrench.mkdirSyncRecursive(this.options.buildPath);

    // Get structure
    var structure = this.buildStructure();

    // Render sections
    this.section.render(null, structure, this.options.breadcrumbs);
};

module.exports = File;

