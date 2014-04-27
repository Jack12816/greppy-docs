/**
 * Assets helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var path = require('path');
var util = require('util');
var wrench = require('wrench');

/**
 * @construct
 */
var Assets = function()
{
    this.rootPath = path.resolve(__dirname, '../..');
    this.imagesPath = path.join(this.rootPath, 'resources', 'public', 'img');
    this.assetsPath = path.join(this.rootPath, 'build', 'assets');
    this.bsFontsSrcPath = path.join(this.rootPath, 'bower_components', 'bootstrap', 'fonts');
    this.faFontsSrcPath = path.join(this.rootPath, 'bower_components', 'font-awesome', 'fonts');
    this.fontsDestPath = path.join(this.rootPath, 'build', 'fonts/');
};

/**
 * Create build directories.
 */
Assets.prototype.createBuildDirectories = function()
{
    var self = this;

    var dirs = [
        'build',
        path.join('build', 'assets'),
        path.join('build', 'reference'),
        path.join('build', 'examples'),
        path.join('build', 'guide')
    ];

    dirs.forEach(function(dir) {

        wrench.mkdirSyncRecursive(path.join(self.rootPath, dir));

        console.log(
            util.format(
                'Directory %s created',
                ('' + dir).cyan
            )
        );
    });
};

/**
 * Copy assets.
 */
Assets.prototype.copyAssets = function()
{
    console.log(
        util.format(
            'Directory %s copied to %s',
            (this.imagesPath.replace(this.rootPath + '/', '')).cyan,
            (this.assetsPath.replace(this.rootPath + '/', '')).cyan
        )
    );

    wrench.copyDirSyncRecursive(
        this.imagesPath, this.assetsPath,
        {forceDelete: true}
    );

    console.log(
        util.format(
            'Directory %s copied to %s',
            (this.faFontsSrcPath.replace(this.rootPath + '/', '')).cyan,
            (this.fontsDestPath.replace(this.rootPath + '/', '')).cyan
        )
    );

    wrench.copyDirSyncRecursive(
        this.faFontsSrcPath, this.fontsDestPath,
        {forceDelete: true}
    );
};

module.exports = Assets;

