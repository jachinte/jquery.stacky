/*
* jquery.stacky - v0.1.0 - 2015-02-14 
* https://github.com/jachinte/jquery.stacky/
* Copyright (c) 2015 Miguel A. Jiménez - http://migueljimenez.co 
*/
;(function ($, window, document, undefined) {
    'use strict';

    var pluginName = 'Stacky';

    $[pluginName] = function(element, options) {

        var defaults = {
            fadeInSpeed: 'fast',
            scrollToSpeed: 400,
            panelDefaults: {
                after: undefined,
                close: {
                    show: true,
                    position: 'right'
                },
                maximize: {
                    show: true,
                    position: 'right'
                },
                navigation: {               
                    left: [],
                    right: []
                },
                content: '',
                floating: false,
                id: '',
                onBeforeOpen: function($panel){
                    // This function is called before fading in the panel
                },
                onBeforeClose: function($panel){
                    /*
                     * This function is called after the panel has been hidden, and 
                     * before removing the DOM element
                     */
                },
                size: 'medium', // thin, medium, wide
                title: ''
            },
            texts: {
                close: 'Close panel',
                collapse: 'Collapse panel',
                expand: 'Expand panel'
            }
        };

        var classes = {
            // Used to indicate the latest added panel
            active: 'active',
            /*
             * It is added to the panel container the first time a panel is appended,
             * to indicate that the click event for closing panels has been already 
             * bound
             */
            closeClickBound: 'close-bound',
            // Used to bind the close action (closing a panel) to a DOM element
            close: 'close',
            // The default close icon
            closeIcon: 'pe-7s-close',
            /*
             * It is added to the panel container the first time a panel is appended,
             * to indicate that the click event for collapsing panels (once they have
             * been extended) has been already bound
             */
            collapseClickBound: 'collapse-bound',
            /* 
             * Used to bind the collapse action (returning a panel to its initial width)
             * to a DOM element
             */
            collapse: 'collapse',
            // The default collapse icon
            collapseIcon: 'pe-7s-angle-down',
            // Provides a way to add styles to the panel content area
            content: 'content',
            // Truncates large titles
            ellipsis: 'ellipsis',
            /*
             * It is added to the panel container the first time a panel is appended,
             * to indicate that the click event for expanding panels has been already 
             * bound
             */
            expandClickBound: 'expand-bound',
            /*
             * Used to bind the expand action (making a panel to fill its container's
             * width) to a DOM element
             */
            expand: 'expand',
            // The default expand icon
            expandIcon: 'pe-7s-angle-up', 
            // Indicates that a panel has been expanded
            expanded: 'expanded',
            // Indicates that a panel must be placed with an absolute position
            floating: 'floating',
            // Util class to change the floating property of a DOM element (set to 'left')
            floatLeft: 'left', 
            // Util class to change the floating property of a DOM element (set to 'right')
            floatRight: 'right',
            // Provides a way to add styles to panels
            panel: 'panel',
            // Util class to add shadow at the left side of a DOM element
            shadowLeft: 'shadow-left',
            // Util class to add shadow at the right side of a DOM element
            shadowRight: 'shadow-right'
        };

        // current instance
        var plugin = this;

        var $element = $(element),  // reference to the jQuery version of DOM element
            element = element;      // reference to the actual DOM element

        // this holds the merged default, and user-provided options
        plugin.settings = {};

        // this holds the stacked panels
        plugin.panels = [];

        // the "constructor" method that gets called when the object is created
        plugin.init = function() {

            // the plugin's final properties are the merged default and
            // user-provided options (if any)
            plugin.settings = $.extend(true, {}, defaults, options);
        };

        // public methods

        // a public method for pushing new panels
        plugin.push = function(panelOptions) {
            var panelSettings = $.extend(true, {}, plugin.settings.panelDefaults, panelOptions),
                panel = createPanelStructure(panelSettings),
                container = $element;

            // As this is the latest panel, show left and right shadow
            panel.addClass(classes.active);
            panel.css('display', 'none').css('z-index', '' + (plugin.panels.length + 1));

            /*
             * Remove shadow in all panels (there is no certainty in which panel has
             * shadow. It is not always the last one)
             */
            container.find('.' + classes.panel)
                .removeClass(classes.active);
            
            /*
             * Append the panel in the corresponding position: after another panel
             * or at the end of all panels
             */
            if(panelSettings.after !== undefined 
                && !panelSettings.after.hasClass(classes.floating)){

                panelSettings.after.after(panel);

                // Store new panel in the panels array
                var previousElemIndex = $element.find('.' + classes.panel).index(panelSettings.after);
                plugin.panels.splice(previousElemIndex + 1, 0, panel);

            }else{
                container.append(panel);
                // Store new panel in the panels array
                plugin.panels.push(panel);
            }

            // Bind click events
            // close panel
            container.not('.' + classes.closeClickBound)
                .addClass(classes.closeClickBound)
                .on('click', '.' + classes.close, { self: plugin, panelSettings: panelSettings }, closePanel);

            // expand panel
            container.not('.' + classes.expandClickBound)
                .addClass(classes.expandClickBound)
                .on('click', '.' + classes.expand, { self: plugin }, expandPanel);

            // collapse panel
            container.not('.' + classes.collapseClickBound)
                .addClass(classes.collapseClickBound)
                .on('click', '.' + classes.collapse, { self: plugin }, collapsePanel);

            // If there is a callback, it is executed
            if(panelSettings.onBeforeOpen 
                && typeof panelSettings.onBeforeOpen === 'function'){
                panelSettings.onBeforeOpen(panel);
            }

            // Finally, show the recently created panel
            panel.fadeIn(plugin.settings.fadeInSpeed);

            if($.fn.scrollTo){
                container.scrollTo(goTo(panelSettings, panel), plugin.settings.scrollToSpeed);
            }
        };

        // private methods

        /*
         * Creates the panel structure with the basic content configuration 
         * (title, navigation and shadows)
         */
        var createPanelStructure = function(panelSettings) {
            var divStr = '<div></div>',
                panel = $('<section></section>')
                            .addClass(classes.panel)
                            .addClass(panelSettings.size),
                header = $('<header></header>'),
                navs = createNavs(panelSettings),
                content = $(divStr).addClass(classes.content),
                article = $('<article></article>'),
                shadowLeft = $(divStr).addClass(classes.shadowLeft),
                shadowRight = $(divStr).addClass(classes.shadowRight);

            if(panelSettings.content !== ''){
                content.append(panelSettings.content);
            }
            header.append(navs).append(shadowLeft.add(shadowRight));

            if(panelSettings.title !== ''){
                var h1 = $('<h1></h1>').addClass(classes.ellipsis).text(panelSettings.title);
                header.append(h1);
            }

            article.append(content);
            panel
                .attr('id', panelSettings.id)
                .append(header)
                .append(article)
                .append(shadowLeft.add(shadowRight));

            if(panelSettings.floating === true){
                panel.addClass(classes.floating);
                var leftOffset = 0;

                if(panelSettings.after !== undefined){
                    var afterElemIndex = $element.find('.' + classes.panel).index(panelSettings.after);

                    for(var i = 0; i < plugin.panels.length && i <= afterElemIndex; i++){
                        leftOffset += plugin.panels[i].outerWidth();
                    }
                }
                panel.css('left', leftOffset + 'px');
            }

            return panel;
        };

        /*
         *  Creates the navigation structure (left and right action links in the header)
         */
        var createNavs = function(panelSettings) {
            var navLeft = $('<nav></nav>').addClass(classes.floatLeft),
                navRight = $('<nav></nav>').addClass(classes.floatRight);

            // Add the expand/collapse link, if activated
            if(panelSettings.maximize.show === true 
                && panelSettings.floating === false
                && (panelSettings.maximize.position === 'left'
                    || panelSettings.maximize.position === 'right')){

                panelSettings.navigation[panelSettings.maximize.position].push({
                    link: '#!',
                    alt: plugin.settings.texts.expand,
                    linkClass: classes.expand,
                    iconClass: classes.expandIcon + ' big-icon'
                });
            }

            // Add the close link, if activated
            if(panelSettings.close.show === true 
                && (panelSettings.close.position === 'left'
                    || panelSettings.close.position === 'right')){

                panelSettings.navigation[panelSettings.close.position].push({
                    link: '#!',
                    alt: plugin.settings.texts.close,
                    linkClass: classes.close,
                    iconClass: classes.closeIcon + ' big-icon'
                });
            }

            // Action links for left nav
            navLeft.append(addActionLinks(panelSettings.navigation.left));
            // Action links for right nav
            navRight.append(addActionLinks(panelSettings.navigation.right));

            // Both navs
            return navLeft.add(navRight);
        };

        /*
         * Returns the element to which the scrollbar should move. If the element
         * is a floating panel, the scrollbar should move to its x position
         */
        var goTo = function(panelSettings, panel) {
            if(panelSettings.floating === true){
                return panel.css('left');
            }else{
                return panel;
            }
        };

        // Utility method to add actions link to an unordered list
        var addActionLinks = function(linksArray) {
            var ul = $('<ul></ul>');
            for(var i = 0; i < linksArray.length; i++){
                var elem = linksArray[i],
                    icon = $('<i></i>').addClass(elem.iconClass),
                    link = $('<a></a>')
                        .attr('href', elem.link)
                        .attr('title', elem.alt)
                        .addClass(elem.linkClass)
                        .append(icon),
                    listItem = $('<li></li>').append(link);
                ul.append(listItem);
            }
            return ul;
        };

        /*
         * Event handler for closing panels
         */
        var closePanel = function (event) {
            var self = event.data.self,
                panelSettings = event.data.panelSettings,
                panel = $(this).closest('.' + classes.panel),
                hasShadow = panel.hasClass(classes.active),
                index = $element.find('.' + classes.panel).index(panel);

            // Hide the panel
            panel.hide();

            // If there is a callback, it is executed
            if(panelSettings.onBeforeClose 
                && typeof panelSettings.onBeforeClose === 'function'){
                panelSettings.onBeforeClose(panel);
            }

            // Remove the panel from the panels array
            plugin.panels.splice(index, 1);

            // Remove the DOM element
            panel.remove();

            if(hasShadow){
                $element.find('.' + classes.panel)
                    .last()
                    .addClass(classes.active);
            }
        };

        /*
         *  Event handler for expanding panels
         */
        var expandPanel = function (event) {
            var self = event.data.self,
                panel = $(this).closest('.' + classes.panel);

            $(this)
                .removeClass(classes.expand)
                .addClass(classes.collapse)
                .attr('title', self.settings.texts.collapse);
            
            $(this)
                .find('i')
                .removeClass(classes.expandIcon)
                .addClass(classes.collapseIcon);

            panel.addClass(classes.expanded);

            if($.fn.scrollTo){
                $element.scrollTo(panel, self.settings.scrollToSpeed);
            }
        };

        /*
         * Event handler for collapsing panels
         */
        var collapsePanel = function (event) {
            var self = event.data.self,
                panel = $(this).closest('.' + classes.panel);

            $(this)
                .removeClass(classes.collapse)
                .addClass(classes.expand)
                .attr('title', self.settings.texts.expand);

            $(this)
                .find('i')
                .removeClass(classes.collapseIcon)
                .addClass(classes.expandIcon);
                
            panel.removeClass(classes.expanded);

            if($.fn.scrollTo){
                $element.scrollTo(panel, self.settings.scrollToSpeed);
            }
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
    
})(jQuery, window, document);