# Stacky
Stacky is a jQuery plugin that gives you the ability to open panels horizontally, as you need them.

## Usage

Include the jQuery library, the stacky plugin and its CSS styles:
```html
<script src="js/jquery.js"></script>
<script src="js/jquery.stacky.js"></script>
<link rel="stylesheet" type="text/css" href="css/jquery.stacky.css" />
```

To initialize the plugin, in the ready function:

```javascript
$( document ).ready(function() {
    var options = { ... };
    $( '#container' ).Stacky( options );
});
```

Where `#container` is the element that will hold all the panels. To push in a new panel:

```javascript
var options = { ... };
$( '#container' ).data( 'Stacky' ).push( options );
```

#### AMD

Stacky can also be used with [require.js](http://requirejs.org/). You can find an example in [demo/basic-requirejs.html](demo/basic-requirejs.html).

## Options

There are two types of options, depending on where you use them, either in the plugin initialization or when pushing in a new panel.

### Plugin initialization options

__fadeInSpeed__: Integer | 'fast' | 'slow'  
The speed (in milliseconds when it's an integer) when making a new panel visible.

__scrollToSpeed__: Integer | 'fast' | 'slow'  
The speed (in milliseconds when it's an integer) with which the scroll bar moves when adding, expanding or collapsing panels.

__panelDefaults__: Object  
An object containing default options to be applied to all new panels. These are the same *Panel pushing options* described in the next subsection.

__texts__: Object  
An object containing the texts that are used as alternative text in action links of each panel. This object may contain the `string` properties *close*, *expand*, and *collapse*. For example:

```javascript
texts: {
    close: 'Close panel',
    expand: 'Expand panel',
    collapse: 'Collapse panel'
}
```

### Panel pushing options

__after__: jQuery object    
If different than undefined, the new panel is inserted after this jQuery element.

__close__: Object    
Action link to close the panel. It may contain the properties *show* (`boolean`) and *position* ('left' | 'right'). For example:

```javascript
close: {
    show: true,
    position: 'left' // or 'right'
}
```

__maximize__: Object    
Action link to expand and collapse the panel. It may contain the properties *show* (`boolean`) and *position* ('left' | 'right'). For example:

```javascript
maximize: {
    show: true,
    position: 'left' // or 'right'
}
```

__navigation__: Object    
Contains two arrays: left and right, holding the action links for the new panel. The structure is as follows:

```javascript
navigation: {
    left: [
        {
            link: '#!',
            alt: 'Open a new panel',
            linkClass: 'open',
            iconClass: 'icon-open'
        },
        ...
    ],
    right: [
        ... 
    ]
}
```

Note: in the demo folder you can find more examples on how to specify the action links. Examples in the demo are using the [__7 Stroke__](http://themes-pixeden.com/font-demos/7-stroke/) icon font pack.

__content__: string    
HTML to be inserted into the panel.

__floating__: boolean  
Indicates if the new panel should be placed using absolute position (`true`) or not (`false`).

__id__: string    
The id attribute of the new panel.

__onBeforeOpen__: function ( $panel )
It's called before fading in the new panel.

__onBeforeClose__: function ( $panel )
It's called before hiding and removing the panel. To indicate that the panel must remain opened, a false value should be returned.

__size__: '' | 'thin' | 'medium' | 'wide'    
The size of the new panel. 

__title__: string    
The panel's title.

## Theming

In the source folder you can find two `.sass` files, one for the general structure and another for colors, borders, sizes, etc. named *theme.scss*.

## Contributing

You are invited to contribute code and suggestions to this project. The more the merrier.
