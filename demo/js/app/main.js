$(document).ready(function(){
    'use strict';

    var sizes = ['thin', 'medium', 'wide'];

    // Returns a random integer between min (included) and max (excluded)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    };

    // Initialize the Stacky plugin
    var stackyContainer = $('#panels').Stacky({
        fadeInSpeed: 'fast',
        scrollToSpeed: 600,
        panelDefaults: {
            content: '',
            navigation: {
                left: [
                    {
                        link: '#!',
                        alt: 'Open a new panel',
                        linkClass: 'open-panel',
                        iconClass: 'fa fa-folder-open-o'
                    },
                    {
                        link: '#!',
                        alt: 'Open a new floating panel',
                        linkClass: 'open-panel open-floating-panel',
                        iconClass: 'fa fa-folder-open'
                    }
                ]
            },
            onBeforeOpen: function($panel){
                console.log('Pushing', $panel);
            },
            onBeforeClose: function($panel){
                console.log('Removed', $panel);
            }
        }
    });

    // Binds click to reate new panels
    $("body").on('click', ".open-panel", function(){
        var self = $(this),
            afterPanel = self.closest('.panel'),
            isFloating = self.hasClass('open-floating-panel'),
            identifier = getRandomInt(0, 1000);

        if(afterPanel.length == 0){
            afterPanel = undefined;
        }
        
        var $panel = stackyContainer.data('Stacky').push({
            title: 'Panel ' + identifier,
            id: 'panel-' + identifier,
            floating: isFloating,
            size: sizes[getRandomInt(0, 3)],    // Create panels of random size
            after: isFloating ? afterPanel : undefined
        });
    });

});