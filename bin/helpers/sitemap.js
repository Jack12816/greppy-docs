/**
 * Sitemap helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var util = require('util');
var resolve = require('path').resolve;
var join = require('path').join;
var fs = require('fs');
var extend = require('extend');
var xml = require('xml');
var moment = require('moment');

/**
 * @construct
 *
 * @param {Object} options - Options object
 */
var Sitemap = function(options)
{
    var self = this;
    this.rootPath = resolve(__dirname, '../..');

    var defaultOptions = {
        outputPath: join(this.rootPath, 'build'),
        entries: []
    };

    // Assemble the options
    this.options = extend({}, defaultOptions, options || {});

    this.buffer = [];

    // Append the passed entries to the buffer
    this.options.entries.forEach(function(item) {
        self.add(item);
    });
};

/**
 * Add a url to the sitemap.
 *
 * @param {Object} url - Url object see http://www.sitemaps.org/protocol.html
 */
Sitemap.prototype.add = function(url)
{
    var defaultUrl = {
        changefreq: 'monthly',
        lastmod: moment().toISOString(),
        priority: 0.5
    };

    var url = extend(defaultUrl, url);
    this.buffer.push(url);
};

/**
 * Write the sitemap file.
 *
 * @param {String} [path] - Output path
 */
Sitemap.prototype.flush = function(path)
{
    if (!path) {
        var path = join(this.options.outputPath, 'sitemap');
    }

    var jsonPath = path + '.json';
    var xmlPath = path + '.xml';

    // Check if we got a existing sitemap
    if (fs.existsSync(jsonPath)) {
        try {
            var existing = JSON.parse(fs.readFileSync(jsonPath));
            this.buffer = this.buffer.concat(existing);
        } catch (e) { }
    }

    // Build a uniq set
    var map = {};

    this.buffer.forEach(function(item) {
        map[item.rel] = item;
    });

    this.buffer = Object.keys(map).map(function(item) {
        return map[item];
    });

    // Write JSON sitemap file
    fs.writeFileSync(
        jsonPath,
        JSON.stringify(this.buffer, null, 2),
        {
            flag: 'w'
        }
    );

    console.log(
        util.format(
            'File %s appended: %s',
            (jsonPath.replace(this.rootPath + '/', '')).cyan,
            fs.statSync(jsonPath).size.memory()
        )
    );

    var xmlData = {
        urlset: [
            {
                _attr: {
                    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
                }
            }
        ]
    };

    // Prepare xml data structure
    this.buffer.forEach(function(item) {

        var node = {
            url: []
        };

        node.url = Object.keys(item).filter(function(name) {

            return ~[
                'loc',
                'changefreq',
                'lastmod',
                'priority'
            ].indexOf(name);

        }).map(function(name) {

            var prop = {};
            prop[name] = item[name];
            return prop;
        });

        xmlData.urlset.push(node);
    });

    // Write XML sitemap file
    fs.writeFileSync(
        xmlPath,
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        xml(xmlData, {
            indent: '  '
        }),
        {
            flag: 'w'
        }
    );

    console.log(
        util.format(
            'File %s created: %s',
            (xmlPath.replace(this.rootPath + '/', '')).cyan,
            fs.statSync(xmlPath).size.memory()
        )
    );

    // Clear the buffer
    this.buffer = [];
};

module.exports = Sitemap;

