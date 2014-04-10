/**
 * Section helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var path = require('path');
var wrench = require('wrench');
var jade = require('jade');
var fs = require('fs');
var extend = require('extend');
var util = require('util');

/**
 * @construct
 *
 * @param {Object} options - Options object
 */
var Section = function(options)
{
    var rootPath = path.resolve(__dirname, '../..');

    var defaultOptions = {
        entry: '',
        entryViewPath: path.join(rootPath, 'resources', 'views', 'index', '%s'),
        subViewPath: path.join(rootPath, 'resources', 'views', 'index', '%s')
    };

    // Assemble the options
    this.options = extend({}, defaultOptions, options || {});

    // Replace paths
    this.options.entryViewPath = util.format(
        this.options.entryViewPath,
        this.options.entry + '.jade'
    );

    this.options.subViewPath = util.format(
        this.options.subViewPath,
        'subsection.jade'
    );

    this.package = require(path.join(rootPath, 'package.json'));
};

/**
 * Recursive view renderer.
 *
 * @param {Array} paths - Array of paths we concat
 * @param {Object} section - Root Section object
 */
Section.prototype.render = function(paths, section)
{
    var self = this;

    // Build the output path
    var joinPaths  = [this.options.buildPath];
    joinPaths      = joinPaths.concat(paths);
    var outputPath = path.join.apply(this, joinPaths);
    joinPaths.push('index.html');
    var outputFile = path.join.apply(this, joinPaths);

    // Get the view path
    var viewPath = this.options.subViewPath;
    if (1 === paths.length && '/' === paths[0]) {
        viewPath = this.options.entryViewPath;
    }

    // Collect subsection names
    var keys = Object.keys(section).filter(function(key) {
        return !/^_/.test(key);
    });

    // Collect subsections
    var subsections = [].concat(keys).map(function(key) {

        // Alias the section
        var res = section[key];

        // Build relative path for links
        var relPaths = [].concat(paths);
        relPaths.unshift(self.options.entry);
        relPaths.push(key);
        relPaths.push('index.html');
        res._path = '/' + path.join.apply(this, relPaths);

        return res;
    });

    // Here comes the rendering stuff
    // Build the output path
    wrench.mkdirSyncRecursive(outputPath);

    // Render the HTML
    var html = jade.renderFile(viewPath, {
        pretty: true,
        package: this.package,
        section: section,
        subsections: subsections
    });

    // Write rendered file
    fs.writeFileSync(outputFile, html);

    console.log(
        'Write file: ' +
        outputFile.replace(this.rootPath, '')
    );

    // We are done for this path
    if (0 === keys.length) {
        return;
    }

    var self = this;

    // Walk through all paths recusivly
    keys.forEach(function(key) {
        var newPaths = [].concat(paths)
        newPaths.push(key);
        self.render(newPaths, section[key]);
    });
};

module.exports = Section;

