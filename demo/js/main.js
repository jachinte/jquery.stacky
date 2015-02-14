$(document).ready(function(){
    'use strict';

    var panels = 0,
        sizes = ['thin', 'medium', 'wide'];

    // Returns a random integer between min (included) and max (excluded)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    };

    $('#panels').Stacky({
        fadeInSpeed: 'fast',
        scrollToSpeed: 300
    });

    // Binds click to reate new panels
    $("body").on('click', ".open-panel", function(){
        
        var afterPanel = $(this).closest('.panel');

        if(afterPanel.length == 0){
            afterPanel = undefined;
        }
        
        $('#panels').data('Stacky').push({
            title: 'Title ' + (panels + 1),
            id: 'panel' + (panels + 1),
            navigation: {
                left: [
                    {
                        link: '#!',
                        alt: 'Open a new panel',
                        linkClass: 'open-panel',
                        iconClass: 'pe-7s-angle-right big-icon'
                    }
                ]
            },
            // floating: getRandomInt(0, 2) === 0 ? true : false,
            size: sizes[getRandomInt(0, 3)],                            // Create panels of random size
            after: getRandomInt(0, 2) === 0 ? afterPanel : undefined    // Open the new panel next to itself or at the end (randome choice)
        });

        panels++;

    });

});