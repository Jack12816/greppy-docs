/**
 * @constructor
 */
var Docs = function()
{
    this.jumperIsVisible = false;
};

/**
 * Scroll to an element.
 *
 * @param {Object} el - jQuery Object
 * @param {Number} [speed] - Speed for scrolling. Default: 300
 */
Docs.prototype.scrollTo = function(el, speed)
{
    $("html, body").animate({
        scrollTop: el.offset().top
    }, speed || 300);
};

/**
 * Scroll to an element with a specific offset.
 *
 * @param {Object} el - jQuery Object
 * @param {Number} offset - Extra offset we add
 * @param {Number} [speed] - Speed for scrolling. Default: 300
 */
Docs.prototype.scrollToWithOffset = function(el, offset, speed)
{
    $("html, body").animate({
        scrollTop: el.offset().top + offset
    }, speed || 300);
};

/**
 * Init the top jumper button.
 */
Docs.prototype.initTopJumper = function()
{
    var self       = this;
    var jumper     = $('#top-jumper');
    var win        = $(window);
    var height     = screen.height;
    var halfHeight = height / 2;

    jumper.on('click', function() {
        self.scrollTo($('body'), 100);
    });

    var onScroll = function() {

        if (win.scrollTop() >= halfHeight) {

            if (false === self.jumperIsVisible) {

                // Show the jumper
                self.jumperIsVisible = true;

                jumper.fadeIn();
            }

        } else {

            if (true === self.jumperIsVisible) {

                // Hide the jumper
                self.jumperIsVisible = false;

                jumper.fadeOut();
            }
        }
    };

    // Run first time unrelated to any event
    onScroll();

    // Bind event
    win.on('scroll', onScroll);

    // Provide a fluent interface
    return this;
};

/**
 * Init a source file.
 */
Docs.prototype.initSourceFile = function()
{
    var self = this;

    var readFragment = function()
    {
        if ('' === location.hash) {
            return;
        }

        var range = !!~location.hash.indexOf('-');
        $('.line').removeClass('active');

        if (range) {

            range = location.hash.replace('#', '')
                                 .replace(/L/gi, '')
                                 .split('-');

            var start = parseInt(range.shift());
            var end = parseInt(range.shift());

            if (isNaN(start) || isNaN(end)) {
                return;
            }

            for (var i = start; i <= end; i++) {
                $('#L' + i).toggleClass('active');
            }

            start = $('#L' + start);

        } else {
            var start = $(location.hash);
            start.toggleClass('active');
        }

        self.scrollToWithOffset(start, -80);

        return false;
    };

    // Fire the first time
    readFragment();

    // Bind for in-page editing
    window.onhashchange = readFragment;

    var writeFragment = function(replacement)
    {
        location.hash = '#' + replacement;
    };

    $('.line-nr').on('click', function(e) {

        if (e.shiftKey) {

            var start = $('.line.active').attr('id') || 'L1';
            var end = $(this).parent().attr('id');
            writeFragment(start + '-' + end);

            e.preventDefault();
            return false;
        }

        $('.line').removeClass('active');
        var cur = $(this);
        var parent = cur.parent();
        parent.toggleClass('active');
        writeFragment(parent.attr('id'));

        e.preventDefault();
        return false;
    });

    // Provide a fluent interface
    return this;
};

/**
 * Init source snippets.
 */
Docs.prototype.initSourceSnippers = function()
{
    $('.code-snippet').on('click', function(e) {

        var cur = $(this);
        var title = cur.attr('data-snippet-title') || 'Source code snippet';
        var code = cur.attr('data-snippet-code') || '';

        var dialog = bootbox.alert({
            title: title,
            message: '<pre style="margin: 0px 0px -15px;">' + code + '</pre>',
            backdrop: true,
            onEscape: function() {}
        });

        e.preventDefault();
        return false;
    });

    // Provide a fluent interface
    return this;
};

/**
 * Run this on a initialized document.
 */
$(document).ready(function() {

    /**
     * Setup a new instance.
     */
    var docs = new Docs();

    /**
     * Run all init methods.
     */
    docs.initTopJumper()
        .initSourceSnippers()
        .initSourceFile();

    /**
     * Autostart tooltips
     */
    $('*[data-toggle=tooltip]').tooltip({
        html: true,
        container: 'body'
    });

    /**
     * Autostart popovers
     */
    $('*[data-toggle=popover]').popover({
        html: true,
        container: 'body'
    });
});

