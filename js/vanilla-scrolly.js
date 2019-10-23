/*
 * Plugin Name: Vanilla-JS Scrolly
 * Version: 0.2.0
 * Plugin URL: https://javascriptutilities.github.io/vanillaScrolly/
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

var vanillaScrolly = function($item, args) {
    'use strict';

    var $parent = $item.parentNode,
        currentStep,
        windowTooNarrow = false,
        nb_steps = 0,
        steps = [],
        bound,
        parent_bound,
        scroll100;

    /* Settings
    -------------------------- */

    if (typeof args != 'object') {
        args = {};
    }

    /* Custom callback on scroll */
    args.callback = args.callback && typeof args.callback == 'function' ? args.callback : function($item, percent, step) {
        // console.log(percent, step);
    };

    /* Custom callback on resize */
    args.callbackresize = args.callbackresize && typeof args.callbackresize == 'function' ? args.callbackresize : function($item, $parent) {};

    /* Disable under this screen width */
    args.minScreenWidth = args.minScreenWidth && typeof args.minScreenWidth == 'number' ? args.minScreenWidth : 0;

    /* Set items
    -------------------------- */

    $parent.style.position = 'relative';
    $item.style.position = 'sticky';
    $item.style.top = 0;

    /* Set steps
    -------------------------- */

    (function() {
        if (!$item.hasAttribute('data-steps') || !parseInt($item.getAttribute('data-steps'), 10)) {
            return;
        }
        nb_steps = parseInt($item.getAttribute('data-steps'), 10);
        if (nb_steps < 2) {
            nb_steps = 0;
            return false;
        }
        var nb_steps_area = Math.max(nb_steps - 1, 2),
            area_size = 100 / nb_steps_area,
            _min, _max;
        for (var i = 1; i <= nb_steps; i++) {
            _max = i * area_size - area_size / 2;
            _min = _max - area_size;
            steps.push({
                min: _min,
                max: _max,
                step: i
            });
        }
    }());

    /* Compute at start and resize
    -------------------------- */

    function setValues() {
        args.callbackresize($item, $parent);
        bound = $item.getBoundingClientRect();
        parent_bound = $parent.getBoundingClientRect();
        scroll100 = parent_bound.height - bound.height;
        windowTooNarrow = window.innerWidth < args.minScreenWidth;
    }
    window.addEventListener('resize', setValues);
    setValues();

    /* Action on scroll
    -------------------------- */

    function scrollEvent() {
        if (windowTooNarrow) {
            return;
        }
        var percent = $item.offsetTop / scroll100 * 100;
        var step = 0;
        if (nb_steps) {
            for (var i = 0, len = steps.length; i < len; i++) {
                if (percent <= steps[i].min || percent > steps[i].max) {
                    continue;
                }
                step = steps[i].step;
                if (currentStep != step) {
                    currentStep = step;
                    $item.setAttribute('data-step', step);
                }
                break;
            }
        }
        args.callback($item, percent, step);
    }
    document.addEventListener('scroll', scrollEvent);
    scrollEvent();
};
