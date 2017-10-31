<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/YTgqkzC8gPbnecNXzgofDQFC/jachinte/jquery.stacky'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/YTgqkzC8gPbnecNXzgofDQFC/jachinte/jquery.stacky.svg' />
</a>

# jQuery.Stacky
[![npm version](https://badge.fury.io/js/jquery.stacky.svg)](http://badge.fury.io/js/jquery.stacky)
[![Bower version](https://badge.fury.io/bo/jquery.stacky.svg)](http://badge.fury.io/bo/jquery.stacky)

Stacky makes it  easy to create UIs with panels that open horizontally using jQuery.

Panels can be opened, closed, expanded and collapsed. A panel can be opened either next to a given panel or a the end, in regular mode (pushed next to a panel) or in floating mode (absolute position). Additionally, the open and close events can optionally call functions to, for instance, set or retrieve data to/from panels.

With this plugin you can easily achieve user interfaces like this:

![Example of usage](http://g.recordit.co/70FTWtUheK.gif)

## Install

The plugin requires jQuery 1.7 or higher. Install via [npm](https://www.npmjs.com/package/jquery.stacky), [bower](https://github.com/jachinte/jquery.stacky/blob/master/bower.json) or [download as a zip](https://github.com/jachinte/jquery.stacky/archive/master.zip):

```
npm install jquery.stacky
```

```
bower install jquery.stacky
```

## Demo

Live demonstration:

- [Basic configuration](http://jachinte.github.io/jquery.stacky/basic.html)
- [Using require.js](http://jachinte.github.io/jquery.stacky/basic-requirejs.html)

You can find the demo files in [here](demo/).

## Usage

Include the jQuery library, the stacky plugin and its CSS styles. These files can be found in the [dist/](dist/) folder.
```html
<script src="path/to/jquery.js"></script>
<script src="path/to/jquery.stacky.min.js"></script>
<link rel="stylesheet" type="text/css" href="path/to/jquery.stacky.css" />
```

Then, initialize the plugin in the element that will hold the panels:

```javascript
$( document ).ready(function() {
    var default_options = { ... };
    var container  = $( '#container' ).Stacky( default_options );
});
```

To push in a new panel use the push method:

```javascript
var panel_options = { ... };
container.data( 'Stacky' ).push( panel_options );
```

## AMD

Stacky can also be used with [require.js](http://requirejs.org/). You can find an example in [demo/basic-requirejs.html](demo/basic-requirejs.html).

## Options

Options can be set either in the plugin initialization or when pushing in a new panel.

#### Plugin initialization options
---

__fadeInSpeed__: Integer | 'fast' | 'slow'  
The fade in speed (in milliseconds when it's an integer) when making a new panel visible.

__scrollToSpeed__: Integer | 'fast' | 'slow'  
The speed (in milliseconds when it's an integer) with which the scroll bar moves when adding, expanding or collapsing panels.

__panelDefaults__: Object  
An object containing default options to be applied to all new panels. These are the same *Panel pushing options* described in the next subsection.

#### Panel pushing options
---

__after__: jQuery object    
If different than undefined, the new panel is inserted after this jQuery element (a panel).

__content__: string    
HTML to be inserted into the panel.

__floating__: boolean  
Indicates if the new panel should be placed either after the 'after' panel [true] or after the other panels (at the end) [false]

__id__: string    
The id attribute of the new panel.

__class__: string    
The class attribute of the new panel. The CSS styles include the helper classes `thin`, `regular`, `medium`, and `wide` to set the panel's width. The `expaned` class can be configured in the CSS to control the expand behavior (default width is 100%)

__onBeforeOpen__: function ( $panel )    
It's called before fading in the new panel.

__onBeforeClose__: function ( $panel )    
It's called before hiding and removing the panel. To indicate that the panel must remain opened, a false value should be returned.

## Util methods

These are utility functions built-in within the plugin. The usage is similar to the `push` method.

__closeActive__: function (  )    
Closes the current active panel (or panels holding the `active` class)

__highlight__: function ( $panel )    
Moves the scroll bar to show the given panel, and then highlights it. This simply shows a left and right shadow for 1 second.

__goTo__: function ( $panel, callback )    
Moves the scroll bar to show the given panel, and then executes the callback, if given.

## Theming

Stacky panels come with the minimum styling. If you want to customize the appearance you can modify the styles in [src/sass/styles.scss](src/sass/styles.scss), and then re-run the grunt command to generate the distribution files again.

With Stacky, and some CSS effort, you can easily develop UIs like this:

![Proof of concept](https://lh5.googleusercontent.com/-IbzrKK6aGVk/VSoIl_cjqrI/AAAAAAAALnY/j0UK7r9n18s/w1374-h691-no/dribbble.png)

## Contributing

You are invited to contribute code and suggestions to this project. The more the merrier.

> Got something to say? let's get in touch: [@jachinte](https://twitter.com/jachinte). Please let me know if you're using Stacky, it's always nice to see what you're using it for!
