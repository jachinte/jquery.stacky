(function ($) {
    'use strict';

    /*
     * This is used to control the z-index property in the panels, in order to
     * stablish an order of creation, and consequently, show the last added one "on top"
     * of the others (i.e., show left and right shadow).
     */
    var count = 1;

    /*
     * Creates the panel structure with the basic content configuration (title, navigation and shadows)
     */
    function createPanelStructure(options) {
        var divStr = '<div></div>',
            panel = $('<section></section>').addClass($.fn.stacky.classes.panelClass).addClass(options.size),
            header = $('<header></header>'),
            navs = createNavs(options),
            content = $(divStr).addClass($.fn.stacky.classes.contentClass),
            article = $('<article></article>'),
            shadowLeft = $(divStr).addClass($.fn.stacky.classes.shadowLeftClass),
            shadowRight = $(divStr).addClass($.fn.stacky.classes.shadowRightClass);

        if(options.panelContent !== ''){
            content.append(options.panelContent);
        }

        header.append(navs).append(shadowLeft.add(shadowRight));

        if(options.title !== ''){
            var h1 = $('<h1></h1>').addClass($.fn.stacky.classes.ellipsisClass).text(options.title);
            header.append(h1);
        }

        article.append(content);
        panel.append(header).append(article);

        if(options.panelId !== ''){
            panel.attr('id', options.panelId);
        }

        panel.append(shadowLeft.add(shadowRight));

        return panel;
    } ;

    /*
     *  Creates the navigation structure (left and right action links in the header)
     */
    function createNavs(options) {
        
        var navLeft = $('<nav></nav>').addClass($.fn.stacky.classes.leftClass),
            navRight = $('<nav></nav>').addClass($.fn.stacky.classes.rightClass);

        if(options.navigation && options.navigation.left){
            var ul = $('<ul></ul>');

            for(var i = 0; i < options.navigation.left.length; i++){
                var elem = options.navigation.left[i];

                var icon = $('<i></i>').addClass(elem.iconClass);
                var link = $('<a></a>').attr('href', elem.link).addClass(elem.linkClass).append(icon);
                var listItem = $('<li></li>').append(link);

                ul.append(listItem);
            }

            navLeft.append(ul);
        }

        if(options.navigation && options.navigation.right){
            var ul = $('<ul></ul>');

            for(var i = 0; i < options.navigation.right.length; i++){
                var elem = options.navigation.right[i];

                var icon = $('<i></i>').addClass(elem.iconClass);
                var link = $('<a></a>').attr('href', elem.link).addClass(elem.linkClass).append(icon);
                var listItem = $('<li></li>').append(link);

                ul.append(listItem);
            }

            navRight.append(ul);
        }

        return navLeft.add(navRight);
    } ;

    /*
     * Push a new panel in the panel container. It can be pushed next to an specific element
     * or at the end.
     */
    $.fn.stacky = function (options) {
        var settings = $.extend({}, $.fn.stacky.defaults, options),
            panel = createPanelStructure(settings),
            container = $('#' + settings.containerId);

        panel.addClass($.fn.stacky.classes.showShadow);
        panel.css('display', 'none').css('z-index', '' + count++);  

        $('#' + settings.containerId + ' .' + $.fn.stacky.classes.panelClass).removeClass($.fn.stacky.classes.showShadow);
        
        if(settings.after !== undefined){
            settings.after.after(panel);
        }else{
            container.append(panel);
        }

        panel.fadeIn(settings.fadeInSpeed);

        if($.fn.scrollTo){
            container.scrollTo(panel, settings.scrollToSpeed);
        }

        return this;
    };

    /*
     * Default list of classes used in styles and here
     */
    $.fn.stacky.classes = {
        panelClass: 'panel',
        hiddenClass: 'hidden',
        showShadow: 'show-shadow',
        shadowLeftClass: 'shadow-left',
        shadowRightClass: 'shadow-right',
        leftClass: 'left',
        rightClass: 'right',
        closeClass: 'close',
        contentClass: 'content',
        ellipsisClass: 'ellipsis'
    };

    /*
     * Settings' default values
     */
    $.fn.stacky.defaults = {
        title: '',
        containerId: 'body',
        panelId: '',
        size: 'medium', // thin, medium, wide
        scrollToSpeed: 400,
        fadeInSpeed: 'fast',
        navigation: {
            left: [],
            right: [
                {
                    link: '#',
                    linkClass: 'close',
                    iconClass: 'pe-7s-close big-icon'
                }
            ]
        },
        panelContent: '',
        after: undefined
    };

}(jQuery));