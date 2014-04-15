/**
 * Assets helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var path = require('path');
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
    wrench.mkdirSyncRecursive(path.join(this.rootPath, 'build'));
    wrench.mkdirSyncRecursive(path.join(this.rootPath, 'build', 'assets'));
    wrench.mkdirSyncRecursive(path.join(this.rootPath, 'build', 'reference'));
    wrench.mkdirSyncRecursive(path.join(this.rootPath, 'build', 'examples'));
    wrench.mkdirSyncRecursive(path.join(this.rootPath, 'build', 'guide'));
};

/**
 * Copy assets.
 */
Assets.prototype.copyAssets = function()
{
    wrench.copyDirSyncRecursive(
        this.imagesPath, this.assetsPath,
        {forceDelete: true}
    );

    wrench.copyDirSyncRecursive(
        this.faFontsSrcPath, this.fontsDestPath,
        {forceDelete: true}
    );
};

module.exports = Assets;

