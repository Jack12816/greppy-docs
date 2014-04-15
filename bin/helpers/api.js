/**
 * API helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var extend = require('extend');
var path = require('path');
var fs = require('fs');
var util = require('util');
var wrench = require('wrench');
var hljs = require('highlight.js');
var greppy = require('greppy');
var greppyPath = greppy.helper.get('path');

var Section = require('./section');

/**
 * @construct
 *
 * @param {Object} options - Options object
 */
var API = function(options)
{
    var rootPath = path.resolve(__dirname, '../..');

    var defaultOptions = {
        entry: 'reference',
        inputPath: path.join(rootPath, 'node_modules', 'greppy', 'lib'),
        buildPath: path.join(rootPath, 'build', '%s'),
        breadcrumbs: [],
        debug: {
            enabled: false,
            exit: false,
            minimalStructure: false,
            dumpCodeFiles: false,
            dumpStructure: false,
            nrOfFiles: 31
        }
    };

    // Assemble the options
    this.options = extend({}, defaultOptions, options || {});

    // Replace paths
    if (this.options.buildPath.contains('%s')) {
        this.options.buildPath = util.format(
            this.options.buildPath,
            this.options.entry
        );
    }

    // Find all index.json files
    this.list = greppyPath.list(this.options.inputPath);

    // Setup docs sections helper
    var defaultSectionOptions = {
        subViewPath: path.join(rootPath, 'resources', 'views', 'api', 'module.jade')
    };
    this.sectionDocsOptions = extend({}, this.options, defaultSectionOptions);
    this.docsSection = new Section(this.sectionDocsOptions);

    // Setup docs sections helper
    var defaultSectionOptions = {
        indexOutput: false,
        outputFileameProperty: '_filename',
        outputFilePrefix: '/../',
        subViewPath: path.join(rootPath, 'resources', 'views', 'api', 'file.jade')
    };
    this.sectionCodeOptions = extend({}, this.options, defaultSectionOptions);
    this.codeSection = new Section(this.sectionCodeOptions);

    // Setup parser and helpers
    this.parser = new (require('./api/parser'))();
    this.classifier = new (require('./api/classifier'))(this.options.inputPath);
    this.sanitizer = new (require('./sanitizer'))();
};

/**
 * Build structure.
 */
API.prototype.buildStructure = function()
{
    var self = this;

    // Initalize the empty structure
    var struct = {};

    // Process the found files
    var files = this.list.filter(function(item) {

        // Only process js files
        return /\.js$/i.test(item);

    }).map(function(item) {

        // Cleanup the path and get the dirname
        var item = item.replace(self.options.inputPath, '').replace(/^\//i, '');
        return path.join(self.options.inputPath, item);

    }).sort();

    // Do some debugging stuff
    if (true === this.options.debug.enabled) {
        files = files.splice(0, this.options.debug.nrOfFiles);
    }

    // Parse the entire source tree and classify it afterwards
    var result = self.classifier.classify(this.parser.parse(files));

    var codeMap = {};

    var codePath = function(item)
    {
        item.inputCodePath = path.join(
            self.options.inputPath,
            item.path,
            item.filename
        );
        item.codePath = path.join(
            '/',
            self.options.entry,
            item.path || 'root',
            item.filename + '.html'
        );
        item.outputCodePath = path.join(
            self.options.buildPath,
            item.path,
            item.filename + '.html'
        );

        if (!codeMap[item.codePath]) {
            codeMap[item.codePath] = {
                filename: item.filename,
                path: item.path,
                inputPath: item.inputCodePath,
                outputPath: item.outputCodePath,
                parts: item.parts,
                classes: item.classes,
                contributors: item.author
            };
            codeMap[item.codePath].parts.push(
                item.name.split('/').pop()
            );
            codeMap[item.codePath].content = self.sanitizer.fixHLjsMarkup(
                hljs.highlight(
                    'javascript',
                    fs.readFileSync(
                        item.inputCodePath, 'utf8'
                    )
                ).value
            );
        }
    };

    // Walk through all nodes and build up a hierarchy
    result.forEach(function(item) {

        var cur = struct;

        for (var i = 0; i < item.parts.length; i++) {

            var part = item.parts[i];

            if (!part) {
                part = 'root'
            }

            if (i === item.parts.length - 1) {

                if (!cur[part]) {
                    cur[part] = {
                        _name: self.sanitizer.sanitizeName(part),
                        _icon: self.sanitizer.nameToIcon(part),
                        _modules: [],
                        _classes: [],
                        _classNames: [],
                        _contributors: []
                    };
                }

                // Do some debugging stuff
                if (true === self.options.debug.enabled &&
                    true === self.options.debug.minimalStructure) {

                    cur[part]._modules.push({
                        longname: item.longname,
                        classes: item.classes.map(function(item) {
                            return item.name
                        })
                    });

                } else {

                    codePath(item);

                    cur[part]._modules.push(item);
                    cur[part]._modules.forEach(function(module) {

                        module.classes.forEach(function(item) {

                            // Skip already mapped classes
                            if (~cur[part]._classNames.indexOf(item.longname)) {
                                return;
                            }

                            codePath(item);
                            cur[part]._classes.push(item);
                            cur[part]._classNames.push(item.longname);
                        });

                        cur[part]._contributors = cur[part]._contributors.concat(
                            module.author
                        );
                    });

                    cur[part]._contributors = Array.uniq(
                        cur[part]._contributors
                    );
                }

                break;
            }

            if (!cur[part]) {
                cur[part] = {
                    _name: self.sanitizer.sanitizeName(part),
                    _icon: self.sanitizer.nameToIcon(part),
                    _modules: [],
                    _classes: [],
                    _classNames: [],
                    _contributors: []
                };
            }

            cur = cur[part];
        }
    });

    // Remap code structure from a map to a array
    var codeEntries = Object.keys(codeMap).map(function(key) {
        return codeMap[key];
    });

    var codeStruct = {};

    codeEntries.forEach(function(item) {

        // Walk through all nodes and build up a hierarchy
        var cur = codeStruct;

        for (var i = 0; i < item.parts.length; i++) {

            var part = item.parts[i];

            if (!part) {
                part = 'root'
            }

            if (i === item.parts.length - 1) {

                if (!cur[part]) {
                    cur[part] = {
                        _name: part.capitalize(),
                        _filename: '',
                        _file: {
                            contributors: [],
                            inputPath: '',
                            outputPath: '',
                            content: '',
                            name: '',
                            path: '',
                            fullPath: '',
                            classes: []
                        }
                    };
                }

                cur[part]._filename = item.filename;
                cur[part]._file = {
                    contributors: (0 !== item.contributors.length) ? Array.uniq(item.contributors) : [],
                    inputPath: item.inputPath,
                    outputPath: item.outputPath,
                    content: item.content,
                    name: item.filename,
                    path: item.path,
                    fullPath: path.join(item.path, item.filename),
                    classes: item.classes
                };

                break;
            }

            if (!cur[part]) {
                cur[part] = {
                    _name: part.capitalize(),
                    _filename: '',
                    _file: {
                        contributors: [],
                        inputPath: '',
                        outputPath: '',
                        content: '',
                        name: '',
                        path: '',
                        fullPath: '',
                        classes: []
                    }
                };
            }

            cur = cur[part];
        }
    });

    // Do some debugging stuff
    if (true === this.options.debug.enabled) {

        if (true === this.options.debug.dumpStructure) {
            console.log(JSON.stringify(struct, null, 4));
        }

        if (true === this.options.debug.dumpCodeFiles) {
            console.log(JSON.stringify(codeStruct, null, 4));
        }

        if (true === this.options.debug.exit) {
            process.exit(1);
        }
    }

    return {
        code: codeStruct,
        docs: struct
    };
};

/**
 * Build the documentation.
 */
API.prototype.build = function()
{
    // Build output directories
    wrench.mkdirSyncRecursive(this.options.buildPath);

    // Get structure
    var structures = this.buildStructure();

    // Render docs sections
    this.docsSection.render(['/'], structures.docs, this.options.breadcrumbs);

    // Render code sections
    this.codeSection.render(['/'], structures.code, this.options.breadcrumbs);
};

module.exports = API;

