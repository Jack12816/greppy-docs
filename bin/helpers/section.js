/**
 * Section helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var greppy = require('greppy');
var path = require('path');
var wrench = require('wrench');
var jade = require('jade');
var fs = require('fs');
var extend = require('extend');
var util = require('util');
var slug = require('slug');
var crypto = require('crypto');
var mustache = require('mustache');
var colors = require('colors');
var mpath = require('mpath');

/**
 * @construct
 *
 * @param {Object} options - Options object
 */
var Section = function(options)
{
    this.rootPath = path.resolve(__dirname, '../..');

    var defaultOptions = {
        indexOutput: true,
        outputFilePrefix: '',
        outputFileExt: 'html',
        outputFileameProperty: '_name',
        entry: '',
        entryViewPath: path.join(this.rootPath, 'resources', 'views', 'index', '%s'),
        subViewPath: path.join(this.rootPath, 'resources', 'views', 'index', '%s'),
        title: '',
        titleRoot: '',
        titleMixin: {},
        sitemapLocPrefix: 'http://docs.greppy.org/framework'
    };

    // Assemble the options
    this.options = extend({}, defaultOptions, options || {});

    // Replace paths
    if (this.options.entryViewPath.contains('%s')) {
        this.options.entryViewPath = util.format(
            this.options.entryViewPath,
            this.options.entry + '.jade'
        );
    }

    if (this.options.subViewPath.contains('%s')) {
        this.options.subViewPath = util.format(
            this.options.subViewPath,
            'subsection.jade'
        );
    }

    this.package = require(path.join(this.rootPath, 'package.json'));
    this.sitemap = new (require('./sitemap'))();
};

/**
 * Prepare author.
 *
 * @param {String} author - Author string like Fullname <email>
 * @return {Object} Prepared author object
 */
Section.prototype.prepareAuthor = function(author)
{
    if ('object' === typeof author) {
        return author;
    }

    author = author.toString();

    var fullname = [];
    var email = '';

    author.split(' ').forEach(function(item) {

        if (/^</.test(item)) {
            email = item.replace(/^</, '')
                        .replace(/>$/, '');
        } else {
            fullname.push(item);
        }
    });

    return {
        fullname: fullname.join(' '),
        email: email,
        gravatar: crypto.createHash('md5').update(email).digest('hex')
    };
};

/**
 * View helper to output a author.
 *
 * @param {String} author - Author string like Fullname <email>
 * @return {String} Rendered author HTML string
 */
Section.prototype.renderAuthor = function(author)
{
    var author = this.prepareAuthor(author);

    return mustache.render([
        '<div class="media">',
            '<a class="pull-left" href="#">',
                '<img class="media-object img-thumbnail" ' +
                'src="http://gravatar.com/avatar/{{gravatar}}?s=50">',
            '</a>',
            '<div class="media-body">{{fullname}}</div>',
        '</div>'
    ].join('\n'), author);
};

/**
 * Recursive view renderer.
 *
 * @param {Array} paths - Array of paths we concat
 * @param {Object} section - Root Section object
 * @param {Array} sections - Path of all passed sections
 */
Section.prototype.render = function(paths, section, sections)
{
    var self = this;
    var skipWrite = false;

    // Setup sections paths if not extist
    if (!sections) {
        sections = [];
    }

    // Setup paths if not exists
    if (!paths) {
        paths = [];
    }

    // Build the output path
    var joinPaths  = [this.options.buildPath];

    if (true === this.options.indexOutput) {

        joinPaths      = joinPaths.concat(paths);
        var outputPath = path.join.apply(this, joinPaths);
        joinPaths.push('index.' + this.options.outputFileExt);
        var outputFile = path.join.apply(this, joinPaths);

    } else {

        var filename = section[this.options.outputFileameProperty];

        if (!filename) {
            skipWrite = true;
        }

        joinPaths      = joinPaths.concat(paths);
        var outputPath = path.join.apply(this, joinPaths);
        joinPaths.push(
            this.options.outputFilePrefix +
            section[this.options.outputFileameProperty] +
            '.' +
            this.options.outputFileExt
        );
        var outputFile = path.resolve(path.join.apply(this, joinPaths));
    }

    // Build the title
    var title = mustache.render(
        self.options.title,
        extend({
            package: this.package,
            section: section,
            subsections: subsections,
            breadcrumbs: sections,
            slug: slug
        }, self.options.titleMixin)
    );

    // Get the view path
    var viewPath = this.options.subViewPath;
    if (1 === paths.length && '/' === paths[0]) {
        viewPath = this.options.entryViewPath;
        title = self.options.titleRoot;
    }

    // Prepare current section if needed
    if (!section._name || !section._path) {
        section._path = '/' + this.options.entry;
        section._name = this.options.entry.capitalize();
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
        pretty: false,
        package: this.package,
        section: section,
        subsections: subsections,
        breadcrumbs: sections,
        slug: slug,
        title: title,
        helper: {
            author: self.renderAuthor.bind(self)
        }
    });

    if (false === skipWrite) {

        // Write rendered file
        fs.writeFileSync(outputFile, html);

        self.sitemap.add({
            rel: outputFile.replace(this.rootPath + '/build', ''),
            loc: self.options.sitemapLocPrefix + outputFile.replace(this.rootPath + '/build', ''),
            title: title
        });

        console.log(
            util.format(
                'File %s created: %s',
                (outputFile.replace(this.rootPath + '/', '')).cyan,
                fs.statSync(outputFile).size.memory()
            )
        );
    }

    // We are done for this path
    if (0 === keys.length) {
        return;
    }

    var self = this;

    // Walk through all paths recusivly
    keys.forEach(function(key) {

        var newPaths = [].concat(paths)
        newPaths.push(key);

        var newSections = [].concat(sections);
        newSections.push(section);

        self.render.call(self, newPaths, section[key], newSections);
    });
};

/**
 * Write the sitemap file.
 *
 * @param {String} [path] - Output path
 */
Section.prototype.flushSitemap = function(path)
{
    this.sitemap.flush(path);
};

module.exports = Section;

