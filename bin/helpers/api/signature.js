/**
 * Signature helper.
 *
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 */

var util = require('util');
var greppy = require('greppy');

/**
 * @construct
 *
 * @param {Object} block - Analysed code block
 */
var Signature = function(block)
{
    this.format = '%s(%s) : %s';
    this.block = block;
};

/**
 * Get the signature string.
 *
 * @return {String} signature
 */
Signature.prototype.get = function()
{
    var self = this;
    var params = [];
    var returns = [];

    if (!this.block || !this.block.params || 0 === this.block.params.length) {
        params.push('void');
    } else {

        this.block.params.forEach(function(param) {

            var enclosure = '%s %s';
            var types = '';

            if (param.type && param.type.names) {
                param.type.names = param.type.names.map(function(item) {
                    return item.capitalize();
                })
                types = param.type.names.join('|');
            }

            if (true === param.optional) {
                enclosure = '[%s %s]';
            }

            params.push(util.format(
                enclosure, types, param.name
            ));
        });
    }

    if (!this.block || !this.block.returns || 0 === this.block.returns.length) {
        returns.push('void');
    } else {

        this.block.returns.forEach(function(ret) {

            var types = '';

            if (ret.type && ret.type.names) {
                ret.type.names = ret.type.names.map(function(item) {
                    return item.capitalize();
                });
                types = ret.type.names.join('|');
            }

            if (ret.description && '' === types) {
                types = ret.description;
                console.log(
                    ' -- Warn: @return without type is given for',
                    self.block.longname
                );
            }

            returns.push(types);
        });
    }

    return util.format(
        this.format,
        this.block.name,
        params.join(', '),
        returns.join(', ')
    );
};

module.exports = Signature;

