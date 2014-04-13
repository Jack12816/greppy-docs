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
    docs.initTopJumper();
});

