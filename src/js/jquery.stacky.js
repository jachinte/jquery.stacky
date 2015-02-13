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
                id: '',
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
            // Util class to change the floating property of a DOM element (set to 'left')
            floatLeft: 'left', 
            // Util class to change the floating property of a DOM element (set to 'right')
            floatRight: 'right',
            // Provides a way to add styles to panels
            panel: 'panel',
            // Used to indicate the latest added panel
            showShadow: 'show-shadow',
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
            panel.addClass(classes.showShadow);
            panel.css('display', 'none').css('z-index', '' + plugin.panels.length);

            /*
             * Remove shadow in all panels (there is no certainty in which panel has
             * shadow. It is not always the last one)
             */
            container.find('.' + classes.panel)
                .removeClass(classes.showShadow);
            
            /*
             * Append the panel in the corresponding position: after another panel
             * or at the end of all panels
             */
            if(panelSettings.after !== undefined){
                panelSettings.after.after(panel);

                // Store new panel in the panels array
                var previousElemIndex = $.inArray(panelSettings.after, plugin.panels);
                plugin.panels.splice(previousElemIndex + 1, 0, panel);

            }else{
                container.append(panel);
                // Store new panel in the panels array
                plugin.panels.push(panel);
            }

            // Finally, show the recently created panel
            panel.fadeIn(plugin.settings.fadeInSpeed);

            // Bind click events
            // close panel
            container.not('.' + classes.closeClickBound)
                .addClass(classes.closeClickBound)
                .on('click', '.' + classes.close, { self: plugin }, closePanel);

            // expand panel
            container.not('.' + classes.expandClickBound)
                .addClass(classes.expandClickBound)
                .on('click', '.' + classes.expand, { self: plugin }, expandPanel);

            // collapse panel
            container.not('.' + classes.collapseClickBound)
                .addClass(classes.collapseClickBound)
                .on('click', '.' + classes.collapse, { self: plugin }, collapsePanel);

            if($.fn.scrollTo){
                container.scrollTo(panel, plugin.settings.scrollToSpeed);
            }
        };

        // private methods

        /*
         * Creates the panel structure with the basic content configuration 
         * (title, navigation and shadows)
         */
        var createPanelStructure = function(panelSettings) {
            var divStr = '<div></div>',
                panel = $('<section></section>').addClass(classes.panel).addClass(panelSettings.size),
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
            panel.append(header).append(article);

            if(panelSettings.id !== ''){
                panel.attr('id', panelSettings.id);
            }

            panel.append(shadowLeft.add(shadowRight));
            return panel;
        };

        /*
         *  Creates the navigation structure (left and right action links in the header)
         */
        var createNavs = function(panelSettings) {
            var navLeft = $('<nav></nav>').addClass(classes.floatLeft),
                navRight = $('<nav></nav>').addClass(classes.floatRight),
                leftUl = $('<ul></ul>'),
                rightUl = $('<ul></ul>');

            // Add the expand/collapse link, if activated
            if(panelSettings.maximize.show === true 
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
            for(var i = 0; i < panelSettings.navigation.left.length; i++){
                var elem = panelSettings.navigation.left[i],
                    icon = $('<i></i>').addClass(elem.iconClass),
                    link = $('<a></a>')
                        .attr('href', elem.link)
                        .attr('title', elem.alt)
                        .addClass(elem.linkClass)
                        .append(icon),
                    listItem = $('<li></li>').append(link);
                leftUl.append(listItem);
            }

            navLeft.append(leftUl);

            // Action links for right nav
            for(var i = 0; i < panelSettings.navigation.right.length; i++){
                var elem = panelSettings.navigation.right[i],
                    icon = $('<i></i>').addClass(elem.iconClass),
                    link = $('<a></a>')
                        .attr('href', elem.link)
                        .attr('title', elem.alt)
                        .addClass(elem.linkClass)
                        .append(icon),
                    listItem = $('<li></li>').append(link);
                rightUl.append(listItem);
            }

            navRight.append(rightUl);

            // Both navs
            return navLeft.add(navRight);
        };

        /*
         * Event handler for closing panels
         */
        var closePanel = function (event) {
            var self = event.data.self,
                panel = $(this).closest('.' + classes.panel),
                hasShadow = panel.hasClass(classes.showShadow);

            // Remove the DOM element
            panel.remove();

            if(hasShadow){
                $element.find('.' + classes.panel)
                    .last()
                    .addClass(classes.showShadow);
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