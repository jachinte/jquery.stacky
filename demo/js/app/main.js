$(document).ready(function(){
    'use strict';

    var sizes = ['thin', 'medium', 'wide'],
        content = $('<div></div>'),
        open = $('<a></a>').addClass('open-panel').append($('<i></i>').addClass('fa fa-folder-open-o')),
        openFloating = $('<a></a>').addClass('open-panel open-floating-panel').append($('<i></i>').addClass('fa fa-folder-open')),
        close = $('<a></a>').addClass('close').append($('<i></i>').addClass('fa fa-times')),
        expand = $('<a></a>').addClass('expand').append($('<i></i>').addClass('fa fa-expand')),
        collapse = $('<a></a>').addClass('collapse').append($('<i></i>').addClass('fa fa-minus')),
        header = $('<header></header>')
                    .append(open)
                    .append(openFloating)
                    .append(expand)
                    .append(collapse)
                    .append(close);

        content.append(header);

    // Returns a random integer between min (included) and max (excluded)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    };

    // Initialize the Stacky plugin
    var stackyContainer = $('#panels').Stacky({
        fadeInSpeed: 'fast',
        scrollToSpeed: 600,
        panelDefaults: {
            content: content.html(),
            onBeforeOpen: function($panel){
                console.log('Pushing', $panel);
            },
            onBeforeClose: function($panel){
                console.log('Removed', $panel);
            }
        }
    });

    // Binds click to create new panels
    $(document).on('click', ".open-panel", function(){
        var self = $(this),
            afterPanel = self.closest('.panel'),
            isFloating = self.hasClass('open-floating-panel'),
            identifier = getRandomInt(0, 1000);

        if(afterPanel.length == 0){
            afterPanel = undefined;
        }
        
        var $panel = stackyContainer.data('Stacky').push({
            id: 'panel-' + identifier,
            floating: isFloating,
            after: isFloating ? afterPanel : undefined
        });
    });

});