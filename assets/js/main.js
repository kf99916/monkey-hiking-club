/*
	Helios by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var settings = {

        // Carousels
        carousels: {
            speed: 4,
            fadeIn: true,
            fadeDelay: 250
        },

    };

    skel.breakpoints({
        wide: '(max-width: 1680px)',
        normal: '(max-width: 1280px)',
        narrow: '(max-width: 960px)',
        narrower: '(max-width: 840px)',
        mobile: '(max-width: 736px)'
    });

    $(function() {

        var $window = $(window),
            $body = $('body');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            $body.removeClass('is-loading');
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9)
            $(':last-child').addClass('last-child');

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on mobile.
        skel.on('+mobile -mobile', function() {
            $.prioritize(
                '.important\\28 mobile\\29',
                skel.breakpoint('mobile').active
            );
        });

        // Dropdowns.
        $('#nav > ul').dropotron({
            mode: 'fade',
            speed: 350,
            noOpenerFade: true,
            alignment: 'center'
        });

        // Scrolly links.
        $('.scrolly').scrolly();

        // Off-Canvas Navigation.

        // Navigation Button.
        $(
                '<div id="navButton">' +
                '<a href="#navPanel" class="toggle"></a>' +
                '</div>'
            )
            .appendTo($body);

        // Navigation Panel.
        $(
                '<div id="navPanel">' +
                '<nav>' +
                $('#nav').navList() +
                '</nav>' +
                '</div>'
            )
            .appendTo($body)
            .panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                target: $body,
                visibleClass: 'navPanel-visible'
            });

        // Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
        if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
            $('#navButton, #navPanel, #page-wrapper')
            .css('transition', 'none');

        // Carousels.
        $('.carousel').each(function() {

            var $t = $(this),
                $forward = $('<span class="forward"></span>'),
                $backward = $('<span class="backward"></span>'),
                $reel = $t.children('.reel'),
                $items = $reel.children('article');

            var pos = 0,
                leftLimit,
                rightLimit,
                itemWidth,
                reelWidth,
                timerId;

            // Items.
            if (settings.carousels.fadeIn) {

                $items.addClass('loading');

                $t.onVisible(function() {
                    var timerId,
                        limit = $items.length - Math.ceil($window.width() / itemWidth);

                    timerId = window.setInterval(function() {
                        var x = $items.filter('.loading'),
                            xf = x.first();

                        if (x.length <= limit) {

                            window.clearInterval(timerId);
                            $items.removeClass('loading');
                            return;

                        }

                        if (skel.vars.IEVersion < 10) {

                            xf.fadeTo(750, 1.0);
                            window.setTimeout(function() {
                                xf.removeClass('loading');
                            }, 50);

                        } else
                            xf.removeClass('loading');

                    }, settings.carousels.fadeDelay);
                }, 50);
            }

            // Main.
            $t._update = function() {
                pos = 0;
                rightLimit = (-1 * reelWidth) + $window.width();
                leftLimit = 0;
                $t._updatePos();
            };

            if (skel.vars.IEVersion < 9)
                $t._updatePos = function() {
                    $reel.css('left', pos);
                };
            else
                $t._updatePos = function() {
                    $reel.css('transform', 'translate(' + pos + 'px, 0)');
                };

            // Forward.
            $forward
                .appendTo($t)
                .hide()
                .mouseenter(function(e) {
                    timerId = window.setInterval(function() {
                        pos -= settings.carousels.speed;

                        if (pos <= rightLimit) {
                            window.clearInterval(timerId);
                            pos = rightLimit;
                        }

                        $t._updatePos();
                    }, 10);
                })
                .mouseleave(function(e) {
                    window.clearInterval(timerId);
                });

            // Backward.
            $backward
                .appendTo($t)
                .hide()
                .mouseenter(function(e) {
                    timerId = window.setInterval(function() {
                        pos += settings.carousels.speed;

                        if (pos >= leftLimit) {

                            window.clearInterval(timerId);
                            pos = leftLimit;

                        }

                        $t._updatePos();
                    }, 10);
                })
                .mouseleave(function(e) {
                    window.clearInterval(timerId);
                });

            // Parallax.
            // Disabled on IE (choppy scrolling) and mobile platforms (poor performance).
            if (skel.vars.browser == 'ie' || skel.vars.mobile) {

                $.fn._parallax = function() {

                    return $(this);

                };

            } else {

                $.fn._parallax = function() {

                    $(this).each(function() {

                        var $this = $(this),
                            on, off;

                        on = function() {

                            $this
                                .css('background-position', 'center 0px');

                            $window
                                .on('scroll._parallax', function() {

                                    var pos = parseInt($window.scrollTop()) - parseInt($this.position().top);

                                    $this.css('background-position', 'center ' + (pos * -0.15) + 'px');

                                });

                        };

                        off = function() {

                            $this
                                .css('background-position', '');

                            $window
                                .off('scroll._parallax');

                        };

                        skel.on('change', function() {

                            if (skel.breakpoint('narrower').active)
                                (off)();
                            else
                                (on)();

                        });

                    });

                    return $(this);

                };

                $window
                    .on('load resize', function() {
                        $window.trigger('scroll');
                    });

            }

            // Spotlights.
            var $spotlights = $('.spotlight');

            $spotlights
                ._parallax()
                .each(function() {

                    var $this = $(this),
                        on, off;

                    on = function() {

                        // Use main <img>'s src as this spotlight's background.
                        $this.css('background-image', 'url("' + $this.find('.image.main > img').attr('src') + '")');

                        // Enable transitions (if supported).
                        if (skel.canUse('transition')) {

                            var top, bottom, mode;

                            // Side-specific scrollex tweaks.
                            if ($this.hasClass('top')) {

                                mode = 'top';
                                top = '-20%';
                                bottom = 0;

                            } else if ($this.hasClass('bottom')) {

                                mode = 'bottom-only';
                                top = 0;
                                bottom = '20%';

                            } else {

                                mode = 'middle';
                                top = 0;
                                bottom = 0;

                            }

                            // Add scrollex.
                            $this.scrollex({
                                mode: mode,
                                top: top,
                                bottom: bottom,
                                initialize: function(t) {
                                    $this.addClass('inactive');
                                },
                                terminate: function(t) {
                                    $this.removeClass('inactive');
                                },
                                enter: function(t) {
                                    $this.removeClass('inactive');
                                },

                                // Uncomment the line below to "rewind" when this spotlight scrolls out of view.

                                //leave:	function(t) { $this.addClass('inactive'); },

                            });

                        }

                    };

                    off = function() {

                        // Clear spotlight's background.
                        $this.css('background-image', '');

                        // Disable transitions (if supported).
                        if (skel.canUse('transition')) {

                            // Remove scrollex.
                            $this.unscrollex();

                        }

                    };

                    skel.on('change', function() {

                        if (skel.breakpoint('narrower').active)
                            (off)();
                        else
                            (on)();

                    });

                });

            // Init.
            $window.load(function() {

                reelWidth = $reel[0].scrollWidth;

                skel.on('change', function() {

                    if (skel.vars.touch) {

                        $reel
                            .css('overflow-y', 'hidden')
                            .css('overflow-x', 'scroll')
                            .scrollLeft(0);
                        $forward.hide();
                        $backward.hide();

                    } else {

                        $reel
                            .css('overflow', 'visible')
                            .scrollLeft(0);
                        $forward.show();
                        $backward.show();

                    }

                    $t._update();

                });

                $window.resize(function() {
                    reelWidth = $reel[0].scrollWidth;
                    $t._update();
                }).trigger('resize');

            });

        });

    });

})(jQuery);
