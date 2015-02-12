$(document).ready(function(){
    'use strict';
    
    var panels = 0;

    $("body").on('click', ".close", function(){
        var panel = $(this).closest(".panel"),
            hasShadow = panel.hasClass('show-shadow');

        panel.remove();
        panels--;

        if(hasShadow){
            $('.panels .panel').last().addClass('show-shadow');
        }
    });

    $("body").on('click', ".open-panel", function(){

        var afterPanel = $(this).closest('.panel');

        if(afterPanel.length == 0){
            afterPanel = undefined;
        }

        var panel = $(".panels").stacky({
                title: 'Title ' + (panels + 1),
                containerId: 'panels',
                panelId: 'panel' + (panels + 1),
                navigation: {
                    right: [
                        {
                            link: '#!',
                            linkClass: 'open-panel',
                            iconClass: 'pe-7s-tools'
                        },
                        {
                            link: '#!',
                            linkClass: 'close',
                            iconClass: 'pe-7s-close big-icon'
                        }
                    ]
                },
                scrollToSpeed: 300,
                size: 'wide',
                after: afterPanel
            });

        panels++;
    });

});