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
                fadeInSpeed: 'fast',        // Speed when making the new panel visible
                scrollToSpeed: 600,         // Speed when moving the scroll bar
                panelDefaults: {            // All panels are created with these settings, unless they override them
                    after: undefined,       // If different than undefined, the new panel is inserted after this jQuery element
                    close: {                // Action link to close the panel
                        show: true,
                        position: 'right'
                    },
                    maximize: {             // Action link to expand and collapse the panel
                        show: true,
                        position: 'right'
                    },
                    navigation: {           // Action links
                        left: [],
                        right: []
                    },
                    content: '',            // HTML to be inserted into the panel
                    floating: false,        // Indicates if the new panel should be placed using absolute position
                    id: '',                 // id attribute of the new panel
                    onBeforeOpen: function ($panel) {},   // It's called before fading in the new panel
                    onBeforeClose: function ($panel) {},  // It's called before hiding and removing the panel.
                                                          // If a false value is returned, the panel must remain opened
                    size: '',               // thin, medium, wide
                    title: ''               // The panel's title
                },
                texts: {                    // Alternative text for action links
                    close: 'Close panel',
                    collapse: 'Collapse panel',
                    expand: 'Expand panel'
                }
            },

            classes = {
                // Used to indicate the latest added panel
                active: 'active',
                // Used to bind the close action (closing a panel) to a DOM element
                close: 'close',
                // The default close icon
                closeIcon: 'fa fa-times',
                /*
                 * Used to bind the collapse action (returning a panel to its initial width)
                 * to a DOM element
                 */
                collapse: 'collapse',
                // The default collapse icon
                collapseIcon: 'fa fa-compress',
                // Provides a way to add styles to the panel content area
                content: 'content',
                // Truncates large titles
                ellipsis: 'ellipsis',
                /*
                 * Used to bind the expand action (making a panel to fill its container's
                 * width) to a DOM element
                 */
                expand: 'expand',
                // The default expand icon
                expandIcon: 'fa fa-expand',
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
                // Provides a way to add styles to panels
                panels: 'panels',
                // Util class to add shadow at the left side of a DOM element
                shadowLeft: 'shadow-left',
                // Util class to add shadow at the right side of a DOM element
                shadowRight: 'shadow-right',
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
            plugin.panels.concat($('.' + classes.panel));
        };
        
        // private methods
        
        // Utility method to add actions link to an unordered list
        var addActionLinks = function (linksArray) {
                var ul = $('<ul></ul>');
                for (var i = 0; i < linksArray.length; i++) {
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
            },
        
            /*
             *  Creates the navigation structure (left and right action links in the header)
             */
            createNavs = function (panelSettings) {
                var navLeft = $('<nav></nav>').addClass(classes.floatLeft),
                    navRight = $('<nav></nav>').addClass(classes.floatRight);

                // Add the expand/collapse link, if activated
                if (panelSettings.maximize.show === true
                        && panelSettings.floating === false
                        && (panelSettings.maximize.position === 'left'
                        || panelSettings.maximize.position === 'right')) {

                    panelSettings.navigation[panelSettings.maximize.position].push({
                        link: '#',
                        alt: plugin.settings.texts.expand,
                        linkClass: classes.expand,
                        iconClass: classes.expandIcon
                    });
                }

                // Add the close link, if activated
                if (panelSettings.close.show === true
                        && (panelSettings.close.position === 'left'
                        || panelSettings.close.position === 'right')) {

                    panelSettings.navigation[panelSettings.close.position].push({
                        link: '#',
                        alt: plugin.settings.texts.close,
                        linkClass: classes.close,
                        iconClass: classes.closeIcon
                    });
                }

                // Action links for left nav
                navLeft.append(addActionLinks(panelSettings.navigation.left));
                // Action links for right nav
                navRight.append(addActionLinks(panelSettings.navigation.right));

                // Both navs
                return navLeft.add(navRight);
            },

            /*
             * Creates the panel structure with the basic content configuration
             * (title, navigation and shadows)
             */
            createPanelStructure = function (panelSettings) {
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

                header
                    .append(navs)
                    .append(shadowLeft.add(shadowRight));

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
                    var _leftOffset = 0;

                    if(panelSettings.after !== undefined){
                        // When the panelSettings.after panel is closed, this floating panel should be closed too
                        panel.attr('data-after-panel', panelSettings.after.attr('id'));

                        // position of panelSettings.after panel
                        _leftOffset = leftOffset(panelSettings.after);
                    }
                    panel.css('left', _leftOffset + 'px');
                }

                return panel;
            },

            leftOffset = function($panel) {
                var panelIndex = $element.find('.' + classes.panel).index($panel),
                    leftOffset = 0;

                for(var i = 0; i < plugin.panels.length && i <= panelIndex; i++){
                    leftOffset += plugin.panels[i].outerWidth();
                }

                return leftOffset;
            },

            /*
             * Event handler for closing panels
             */
            closePanel = function (event) {
                var self = event.data.self,
                    callback = event.data.callback,
                    panel = event.data.panel,
                    hasShadow = panel.hasClass(classes.active),
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

                if(hasShadow){
                    $element.find('.' + classes.panel)
                        .last()
                        .addClass(classes.active);
                }
            },

            /*
             *  Event handler for expanding panels
             */
            expandPanel = function (event) {
                var self = event.data.self,
                    panel = event.data.panel;

                $(this)
                    .removeClass(classes.expand)
                    .addClass(classes.collapse)
                    .attr('title', self.settings.texts.collapse);

                $(this)
                    .find('i')
                    .removeClass(classes.expandIcon)
                    .addClass(classes.collapseIcon);

                panel.addClass(classes.expanded);
                $element.animate({scrollLeft: leftOffset(panel)}, self.settings.scrollToSpeed);
            },

            /*
             * Event handler for collapsing panels
             */
            collapsePanel = function (event) {
                var self = event.data.self,
                    panel = event.data.panel;

                $(this)
                    .removeClass(classes.collapse)
                    .addClass(classes.expand)
                    .attr('title', self.settings.texts.expand);

                $(this)
                    .find('i')
                    .removeClass(classes.collapseIcon)
                    .addClass(classes.expandIcon);

                panel.removeClass(classes.expanded);
                $element.animate({scrollLeft: leftOffset(panel)}, self.settings.scrollToSpeed);
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

            var panel = createPanelStructure(panelSettings);

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
            // close panel
            panel.on('click', '.' + classes.close, { self: plugin, callback: panelSettings.onBeforeClose, panel: panel }, closePanel);

            // expand panel
            panel.on('click', '.' + classes.expand, { self: plugin, panel: panel }, expandPanel);

            // collapse panel
            panel.on('click', '.' + classes.collapse, { self: plugin, panel: panel }, collapsePanel);

            // If there is a callback, execute it!
            if(panelSettings.onBeforeOpen
                && typeof panelSettings.onBeforeOpen === 'function'){
                panelSettings.onBeforeOpen(panel);
            }

            // Finally, show the recently created panel
            panel.fadeIn(plugin.settings.fadeInSpeed);
            container.animate({scrollLeft: leftOffset(panel)}, plugin.settings.scrollToSpeed);

            // Return the jQuery object
            return panel;
        };

        plugin.closeActivePanel = function() {
            var activePanel = $element.find('.' + classes.active);
            activePanel.find(classes.close).trigger('click');
        };

        plugin.highlightPanel = function($panel) {
            $panel.addClass(classes.highlight);
            $element.animate({scrollLeft: leftOffset($panel)}, plugin.settings.scrollToSpeed);

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
