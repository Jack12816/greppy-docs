/**
 * Documentation config
 */
var config = {};

/**
 * Paths
 */
var path = require('path');
var rootPath = path.resolve(__dirname, '..');

/**
 * Breadcrumbs
 */
config.breadcrumbs = [

    // Documentation entry
    {
        _name: 'Documentation',
        _path: '/../'
    },

    // Framework entry
    {
        _name: 'Framework',
        _path: '/'
    }
];

/**
 * Sitemap
 */
var sitemapLocPrefix = 'http://docs.greppy.org';
config.sitemap = {
    locPrefix: sitemapLocPrefix,
    entries: [
        {
            loc: sitemapLocPrefix + (process.env.BASE_PATH || '') + '/',
            title: 'Greppy Framework'
        }
    ]
};

/**
 * Files
 */
config.files = [

    // Readme
    {
        title: 'Readme',
        entry: 'readme',
        icon: 'fa-file-text-o',
        inputPath: path.join(rootPath, 'node_modules', 'greppy', 'README.md')
    },

    // Changelog
    {
        title: 'Changelog',
        entry: 'changelog',
        icon: 'fa-clock-o',
        inputPath: path.join(rootPath, 'node_modules', 'greppy', 'CHANGELOG.md')
    }
];

/**
 * Documentations
 */
config.documentations = [

    // Guide
    {
        titleRoot: 'Guide',
        title: 'Guide &bull; {{section._name}}',
        entry: 'guide'
    },

    // Cookbook
    {
        titleRoot: 'Cookbook',
        title: 'Cookbook &bull; {{section._name}}',
        entry: 'cookbook'
    }
];

/**
 * API Reference
 */
config.api = {
    debug: {
        enabled: false,
        exit: false,
        minimalStructure: false,
        dumpCodeFiles: false,
        dumpStructure: false,
        nrOfFiles: 71
    }
};

/**
 * Export
 */
module.exports = config;

