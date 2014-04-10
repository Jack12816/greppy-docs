/**
 * Markdown render helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var path = require('path');
var marked = require('marked');
var fs = require('fs');

/**
 * @construct
 */
var Markdown = function()
{
};

/**
 * Search, sort, read, concat and render all
 * markdown files for a path.
 *
 * @param {String} markdownPath - Path to render
 * @return {String}
 */
Markdown.prototype.renderFilesForPath = function(markdownPath)
{
    var content = fs.readdirSync(markdownPath).filter(function(item) {

        // Filter markdown files
        return /\.md$/.test(item);

    }).sort().map(function(item) {

        // Read the file content
        return fs.readFileSync(path.join(markdownPath, item));

    }).join('\n');

    return marked(content, {
        breaks: false
    });
};

module.exports = Markdown;

