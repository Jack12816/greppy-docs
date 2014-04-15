/**
 * Sanitize helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var path = require('path');

/**
 * @construct
 */
var Sanitizer = function()
{
    var rootPath = path.resolve(__dirname, '../..');

    // Icon map
    this.iconMap = require(path.join(rootPath, 'docs', 'icon.map.json'));

    // Abbreviation map
    this.abbrevMap = require(path.join(rootPath, 'docs', 'abbreviation.map.json'));
};

/**
 * Fix highlight.js markup.
 *
 * @param {String} code - Highlighted code
 * @return {String}
 */
Sanitizer.prototype.fixHLjsMarkup = function(code)
{
    var blockComments = code.match(
        /<span class="hljs-comment">\/\*\*[^]*?\*\/<\/span>/gi
    );

    if (!blockComments) {
        return code;
    }

    var start = '<span class="hljs-comment">';
    var end = '</span>';

    blockComments.forEach(function(block) {

        var replacement = block.split('\n').map(function(line) {

            if (/^<span/.test(line)) {
               return line + end;
            } else if (/<\/span>$/.test(line)) {
                return start + line;
            } else {
                return start + line + end;
            }
        }).join('\n');

        code = code.replace(block, replacement);
    });

    return code;
};

/**
 * Convert a name to a icon.
 *
 * @param {String} name - Name to convert
 * @return {String} The name of the matching icon
 */
Sanitizer.prototype.nameToIcon = function(name)
{
    var name = name.toLowerCase();

    // Try different ways with different
    // performance levels
    // First try a direct match
    if (this.iconMap[name]) {
        return this.iconMap[name];
    }

    var self = this;
    var icon = null;

    // Try to find as partial
    Object.keys(this.iconMap).some(function(part) {
        if (~name.indexOf(part)) {
            icon = self.iconMap[part];
            return true;
        }
    });

    if (icon) {
        return icon;
    }

    // Nothing was found - return default
    return 'fa-circle';
};

/**
 * Sanitize a given name, convert abbreviations etc.
 *
 * @param {String} name - Name to sanitize
 * @return {String} The sanitized name
 */
Sanitizer.prototype.sanitizeName = function(name)
{
    var name = name.toLowerCase();

    // Check for uppercasing
    if (~this.abbrevMap.uppercase.indexOf(name)) {
        return name.toUpperCase();
    }

    // Check for lowercasing
    if (~this.abbrevMap.lowercase.indexOf(name)) {
        return name.toLowerCase();
    }

    return name.capitalize();
};

module.exports = Sanitizer;

