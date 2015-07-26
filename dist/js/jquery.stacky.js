/*!
 * jquery.stacky
 * Copyright (c) 2015 Miguel Jiménez - migueljimenezachinte<a>gmail<d>com | http://migueljimenez.co
 * Licensed under the MIT license.
 * https://github.com/jachinte/jquery.stacky
 * @projectDescription Stacky is a jQuery plugin that gives you the ability to open panels horizontally, as you need them.
 * @author Miguel Jiménez
 * @version v0.3.5
 */
; (function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var pluginName = 'Stacky';

    $[pluginName] = function (elemNode, options) {

        var defaults = {
                fadeInSpeed: 'fast',            // Speed when making the new panel visible
                scrollToSpeed: 600,             // Speed when moving the scroll bar
                panelDefaults: {                // All panels are created with these settings, unless they override them
                    after: undefined,           // If different than undefined, the new panel is inserted after this jQuery element
                    content: '',                // HTML to be inserted into the panel
                    floating: false,            // Indicates if the new panel should be placed using absolute position
                    id: '',                     // id attribute of the new panel
                    class: '',                  // class attribute of the new panel
                    onBeforeOpen: function ($panel) {},   // It's called before fading in the new panel
                    onBeforeClose: function ($panel) {},  // It's called before hiding and removing the panel.
                                                          // If a false value is returned, the panel must remain opened
                }
            },

            classes = {
                // Used to indicate the latest added panel
                active: 'active',
                // Used to bind the close action (closing a panel) to a DOM element
                close: 'close',
                /*
                 * Used to bind the collapse action (returning a panel to its initial width)
                 * to a DOM element
                 */
                collapse: 'collapse',
                /*
                 * Used to bind the expand action (making a panel to fill its container's
                 * width) to a DOM element
                 */
                expand: 'expand',
                // Indicates that a panel has been expanded
                expanded: 'expanded',
                // Indicates that a panel must be placed with an absolute position
                floating: 'floating',
                // Provides a way to add styles to panels
                panel: 'panel',
                // Provides a way to add styles to panels
                panels: 'panels',
                // Highlights certain panel
                highlight: 'highlight'
            },

            // current instance
            plugin = this,

            $element = $(elemNode),  // reference to the jQuery version of the DOM element
            element = elemNode;      // reference to the actual DOM element

        // this holds the merged default, and user-provided options
        plugin.settings = {};

        // this holds the stacked panels
        plugin.panels = [];

        // the "constructor" method that gets called when the object is created
        plugin.init = function () {

            // the plugin's final properties are the merged default and
            // user-provided options (if any)
            plugin.settings = $.extend(true, {}, defaults, options);
            $element.addClass(classes.panels);

            // Include panels already appended to the panels container
            var existingPanels = $('.' + classes.panel);
            existingPanels.each(function (i) {
                var panel = $(this);

                panel.css('z-index', (i + 1) + '');
                _bindEvents(panel, plugin.settings.onBeforeClose);

                if(i === existingPanels.length - 1){
                    panel.addClass(classes.active);
                }

                plugin.panels.push(panel);
            });
        };
        
        // private methods

            /*
             * Creates the panel structure with the basic content configuration
             */
        var _createPanelStructure = function (panelSettings) {
                // divs to highlight the panel
                var leftShadow = $('<div></div>').addClass('shadow-left'),
                    rightShadow = $('<div></div>').addClass('shadow-right'),
                    id = panelSettings.id || _randomID(8),

                // The panel structure
                    panel = $('<section></section>')
                        .addClass(classes.panel)
                        .addClass(panelSettings.class)
                        .attr('id', id)
                        .append(panelSettings.content)
                        .append(leftShadow)
                        .append(rightShadow);

                if(panelSettings.floating === true){
                    panel.addClass(classes.floating);
                    var offset = 0;

                    if(panelSettings.after !== undefined){
                        // When the panelSettings.after panel is closed, this floating panel should be closed too
                        panel.attr('data-after-panel', panelSettings.after.attr('id'));
                        // position of panelSettings.after panel
                        offset = _leftOffset(panelSettings.after);
                    }

                    panel.css('left', offset + 'px');
                }

                return panel;
            },

            _leftOffset = function($panel) {
                return $panel.offset().left + (
                    $element['scrollLeft']() - $element.offset()['left']
                );
            },

            _bindEvents = function (panel, onBeforeClose) {
                /*
                 * Hide the collapse/expand element depending
                 * on the current state of the panel
                 */
                var hideClass = panel.hasClass(classes.expanded) ?
                                    classes.expand : classes.collapse;
                panel
                    .find('.' + hideClass)
                    .hide();

                // close panel
                panel.on('click', '.' + classes.close, { 
                    self: plugin, 
                    callback: onBeforeClose, 
                    panel: panel 
                }, _closePanel);

                // expand panel
                panel.on('click', '.' + classes.expand, { 
                    self: plugin, 
                    panel: panel 
                }, _expandPanel);

                // collapse panel
                panel.on('click', '.' + classes.collapse, { 
                    self: plugin, 
                    panel: panel 
                }, _collapsePanel);
            },

            /*
             * Event handler for closing panels
             */
            _closePanel = function (event) {
                var self = event.data.self,
                    callback = event.data.callback,
                    panel = event.data.panel,
                    isActive = panel.hasClass(classes.active),
                    index = $element.find('.' + classes.panel).index(panel);

                // If there is a callback, execute it!
                if(typeof callback === 'function'){
                    // If a false value is returned by the callback, the panel must remain opened
                    if(callback(panel) === false){
                        event.preventDefault();
                        return;
                    }
                }

                // Update all panels depending on this one, and trigger their close event
                $('.' + classes.panel + '[data-after-panel=' + panel.attr('id') + ']')
                    .removeAttr('data-after-panel')
                    .css('left', '0px')
                    .find('.' + classes.close).trigger('click');

                // Hide the panel
                panel.hide();

                // Remove the panel from the panels array
                plugin.panels.splice(index, 1);

                // Remove the DOM element
                panel.remove();

                if(isActive){
                    $element.find('.' + classes.panel)
                        .last()
                        .addClass(classes.active);
                }
            },

            /*
             *  Event handler for expanding panels
             */
            _expandPanel = function (event) {
                var self = event.data.self,
                    panel = event.data.panel;

                $(this)
                    .hide();

                $(this)
                    .closest('.' + classes.panel)
                    .find('.' + classes.collapse)
                    .show();

                panel.addClass(classes.expanded);
                $element.animate({scrollLeft: _leftOffset(panel)}, self.settings.scrollToSpeed);
            },

            /*
             * Event handler for collapsing panels
             */
            _collapsePanel = function (event) {
                var self = event.data.self,
                    panel = event.data.panel;

                $(this)
                    .hide();

                $(this)
                    .closest('.' + classes.panel)
                    .find('.' + classes.expand)
                    .show();

                panel.removeClass(classes.expanded);
                $element.animate({scrollLeft: _leftOffset(panel)}, self.settings.scrollToSpeed);
            },

            /*
             * Generates a random id, in case a panel is not given an id
             * Source: http://stackoverflow.com/a/6861381/738968
             */
            _randomID = function (length) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(''),
                    str = '';

                if (!length) {
                    length = Math.floor(Math.random() * chars.length);
                }

                for (var i = 0; i < length; i++) {
                    str += chars[Math.floor(Math.random() * chars.length)];
                }

                return str;
            };

        // public methods

        /**
         * A public method for pushing new panels
         */
        plugin.push = function (panelOptions) {
            var panelSettings = $.extend(true, {}, plugin.settings.panelDefaults, panelOptions),
                container = $element,
                prop;

            // Replace specific values in panelSettings (not done by $.extend)
            for (prop in panelOptions) {
                if (panelOptions.hasOwnProperty(prop)) {
                    panelSettings[prop] = panelOptions[prop];
                }
            }

            var panel = _createPanelStructure(panelSettings),
                zindex = (plugin.panels.length + 1) + '';

            if((typeof panelOptions !== 'undefined') 
                && panelOptions.floating === true){
                zindex = '10' + zindex;
            }

            // As this is the latest panel, add the active class
            panel.addClass(classes.active);
            panel
                .css('display', 'none')
                .css('z-index', '' + zindex);

            /*
             * Remove the active class in all panels (there is no certainty 
             * in which panel is active. It is not always the last one)
             */
            container
                .find('.' + classes.panel)
                .removeClass(classes.active);

            /*
             * Append the panel in the corresponding position: after another panel
             * or at the end of all panels
             */
            if(panelSettings.after !== undefined
                && !panelSettings.after.hasClass(classes.floating)){

                panelSettings.after.after(panel);

                // Store new panel in the panels array
                var previousElemIndex = $element
                    .find('.' + classes.panel)
                    .index(panelSettings.after);
                plugin.panels.splice(previousElemIndex + 1, 0, panel);

            }else{
                // Causes weird left space because of html markup
                // container.append(panel);
                // The solution is to insert the panel after the last one
                var $last = plugin.panels[plugin.panels.length - 1];
                
                if($last !== undefined){
                    $last.after(panel);
                }else{
                    container.append(panel);
                }

                // Store the new panel in the panels array
                plugin.panels.push(panel);
            }

            // Bind click events
            _bindEvents(panel, panelSettings.onBeforeClose);

            // If there is a callback, execute it!
            if(panelSettings.onBeforeOpen
                && typeof panelSettings.onBeforeOpen === 'function'){
                panelSettings.onBeforeOpen(panel);
            }

            // Finally, show the recently created panel
            panel.fadeIn(plugin.settings.fadeInSpeed);
            container.animate({ scrollLeft: _leftOffset(panel) }, plugin.settings.scrollToSpeed);

            // Return the jQuery object
            return panel;
        };

        plugin.closeActivePanel = function() {
            var activePanel = $element.find('.' + classes.active);
            activePanel.find(classes.close).trigger('click');
        };

        plugin.highlightPanel = function($panel) {
            $panel.addClass(classes.highlight);
            $element.animate({scrollLeft: _leftOffset($panel)}, plugin.settings.scrollToSpeed);

            setTimeout(function(){
                $panel.removeClass(classes.highlight);
            }, 600);
        };

        // call the "constructor" method
        plugin.init();
    };

     // add the plugin to the jQuery.fn object
     $.fn[pluginName] = function(options) {
        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
          // if plugin has not already been attached to the element
          if (undefined == $(this).data(pluginName)) {
              // create a new instance of the plugin
              // pass the DOM element and the user-provided options as arguments
              var plugin = new $[pluginName](this, options);
              $(this).data(pluginName, plugin);
           }
        });
    };

}));
