/**
 * Markdown render helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var path = require('path');
var slug = require('slug');
var util = require('util');
var fs = require('fs');

/**
 * @construct
 */
var Markdown = function()
{
    this.marked = require('marked');

    this.marked.setOptions({
        highlight: function (code) {
            return require('highlight.js').highlightAuto(code).value;
        }
    });
};

/**
 * Build a table of contents.
 *
 * @param {String} content - Markdown content
 * @return {Object} {content, toc}
 */
Markdown.prototype.buildTableOfContents = function(content)
{
    var toc = [];

    content = content.split('\n').map(function(line) {

        // Filter only heading lines
        if (/^#/.test(line)) {

            var heading = line.replace(/^[#]+ /, '').trim();
            var headingSlug = slug(heading).toLowerCase();
            var mdLevel = line.replace(/[^#]+/, '').trim();

            mdLevel = mdLevel.replace(/#/g, '*')
                             .replace('******', '          *')
                             .replace('*****', '        *')
                             .replace('****', '      *')
                             .replace('***', '    *')
                             .replace('**', '  *')

            var mdHeading = util.format(
                '%s [%s](#%s)',
                mdLevel, heading, headingSlug
            );

            // Add heading to the map
            toc.push(mdHeading);

            // Extend the original content
            // line = util.format(
            //     '%s\n<a name="%s"></a>',
            //     line, headingSlug
            // );
        }

        return line;
    });

    return {
        content: content.join('\n'),
        toc: toc.join('\n')
    };
};

/**
 * Search, sort, read, concat and render all
 * markdown files for a path.
 *
 * @param {String} markdownPath - Path to render
 * @param {Object} doc - Documentation object
 * @return {String}
 */
Markdown.prototype.renderFiles = function(markdownPath, doc)
{
    var stat = fs.statSync(markdownPath);
    var content = '';

    if (stat.isFile()) {
        content = fs.readFileSync(markdownPath).toString();
    } else if (stat.isDirectory()) {
        content = fs.readdirSync(markdownPath).filter(function(item) {

            // Filter markdown files
            return /\.md$/.test(item);

        }).sort().map(function(item) {

            // Read the file content
            return fs.readFileSync(path.join(markdownPath, item));

        }).join('\n');
    }

    // Build table of contents
    var build = this.buildTableOfContents(content);
    var topSlug = slug(doc.name).toLowerCase();

    // // Add current 1st level
    // build.content = util.format(
    //     '<a name="%s"></a>\n%s',
    //     topSlug, build.content
    // );

    build.content = this.marked(build.content, {
        breaks: false
    });

    // Add current 1st level
    build.toc = util.format(
        '* [%s](#%s)\n%s',
        doc.name, topSlug, build.toc
    );

    build.toc = this.marked(build.toc, {
        breaks: false
    });

    return build;
};

module.exports = Markdown;

