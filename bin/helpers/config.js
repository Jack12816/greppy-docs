/**
 * Config helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var extend = require('extend');

/**
 * @construct
 *
 * @param {Object} config - Root config object
 */
var Config = function(config)
{
    this.defaultConfig = {
        breadcrumbs: config.breadcrumbs,
        sitemapLocPrefix: config.sitemap.locPrefix,
        sitemapEntries: config.sitemap.entries
    };
};

/**
 * Prepare a config for a documentation.
 *
 * @param {Object} entry - Config object to prepare
 * @return {Object} The prepared config object
 */
Config.prototype.prepareEntry = function(entry)
{
    return extend({}, this.defaultConfig, entry);
};

module.exports = Config;

