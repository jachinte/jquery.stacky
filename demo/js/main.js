$(document).ready(function(){
    'use strict';

    var sizes = ['thin', 'medium', 'wide'];

    // Returns a random integer between min (included) and max (excluded)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    };

    $('#panels').Stacky({
        fadeInSpeed: 'fast',
        scrollToSpeed: 600,
        panelDefaults: {
            navigation: {
                left: [
                    {
                        link: '#!',
                        alt: 'Open a new panel',
                        linkClass: 'open-panel',
                        iconClass: 'pe-7s-angle-right big-icon'
                    },
                    {
                        link: '#!',
                        alt: 'Open a new floating panel',
                        linkClass: 'open-panel open-floating-panel',
                        iconClass: 'pe-7s-angle-right-circle'
                    }
                ]
            },
            onBeforeOpen: function($panel){
                console.log('About to be shown', $panel);
            },
            onBeforeClose: function($panel){
                console.log('About to be removed', $panel);
            }
        }
    });

    // Binds click to reate new panels
    $("body").on('click', ".open-panel", function(){
        
        var self = $(this),
            afterPanel = self.closest('.panel'),
            identifier = getRandomInt(0, 1000);

        if(afterPanel.length == 0){
            afterPanel = undefined;
        }
        
        var $newpanel = $('#panels').data('Stacky').push({
                            title: 'Title ' + identifier,
                            id: 'panel' + identifier,
                            floating: self.hasClass('open-floating-panel'),
                            size: sizes[getRandomInt(0, 3)],    // Create panels of random size
                            after: afterPanel                   // Open the new panel next to itself
                        });
    });

});