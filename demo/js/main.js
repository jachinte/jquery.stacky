$(document).ready(function(){
    'use strict';

    var panels = 0;

    // Returns a random integer between min (included) and max (excluded)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    } ;

    // Closes a panel
    $("body").on('click', ".close", function(){
        var panel = $(this).closest(".panel"),
            hasShadow = panel.hasClass('show-shadow');

        panel.remove();
        panels--;

        if(hasShadow){
            $('.panels .panel').last().addClass('show-shadow');
        }
    });

    // Expands/Collapses a panel
    $("body").on('click', '.expand, .collapse', function(){
        var panel = $(this).closest(".panel");

        if($(this).hasClass('expand')){
            $(this)
                .removeClass('expand')
                .addClass('collapse')
                .attr('title', 'Collapse panel');
            
            $(this)
                .find('i')
                .removeClass('pe-7s-angle-up')
                .addClass('pe-7s-angle-down');

            panel.addClass('expanded');
        }else{
            $(this)
                .removeClass('collapse')
                .addClass('expand')
                .attr('title', 'Expand panel');

            $(this)
                .find('i')
                .removeClass('pe-7s-angle-down')
                .addClass('pe-7s-angle-up');
                
            panel.removeClass('expanded');
        }

        $('#panels').scrollTo(panel, 300);
    });

    // Creates a new panel
    $("body").on('click', ".open-panel", function(){

        var afterPanel = $(this).closest('.panel'),
            sizes = ['wide', 'medium', 'thin'];

        if(afterPanel.length == 0){
            afterPanel = undefined;
        }

        var panel = $(".panels").stacky({
                title: 'Title ' + (panels + 1),
                containerId: 'panels',
                panelId: 'panel' + (panels + 1),
                navigation: {
                    left: [
                        {
                            link: '#!',
                            alt: 'Expand panel',
                            linkClass: 'expand',
                            iconClass: 'pe-7s-angle-up big-icon'
                        }
                    ],
                    right: [
                        {
                            link: '#!',
                            alt: 'Open a new panel',
                            linkClass: 'open-panel',
                            iconClass: 'pe-7s-angle-right big-icon'
                        },
                        {
                            link: '#!',
                            alt: 'Close panel',
                            linkClass: 'close',
                            iconClass: 'pe-7s-close big-icon'
                        }
                    ]
                },
                scrollToSpeed: 300,
                size: sizes[getRandomInt(0, 3)],
                after: afterPanel
            });

        panels++;
    });

});